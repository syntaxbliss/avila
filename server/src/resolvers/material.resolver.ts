import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { MaterialEntity, MaterialSupplierEntity, SupplierEntity } from 'src/entities';
import {
  PaginationInput,
  SaveMaterialInput,
  SearchMaterialInput,
  UpdateMaterialQuantityInput,
  saveMaterialSchema,
  updateMaterialQuantitySchema,
} from 'src/input-types';
import { SupplierLoader } from 'src/loaders';
import { mapMaterialEntityToMaterial } from 'src/mappers';
import { Material, PaginatedMaterials, Supplier } from 'src/object-types';
import { DataSource, In, IsNull, Not } from 'typeorm';

@Resolver(() => Material)
export default class MaterialResolver {
  constructor(private readonly ds: DataSource, private readonly supplierLoader: SupplierLoader) {}

  @Query(() => PaginatedMaterials)
  async materials(
    @Args('searchParams', { nullable: true }) searchParams?: SearchMaterialInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedMaterials> {
    const query = this.ds.manager.createQueryBuilder(MaterialEntity, 'material');

    if (searchParams?.name) {
      query.where('material.name LIKE :name', { name: `%${searchParams.name}%` });
    }

    if (searchParams?.code) {
      query.andWhere('material.code LIKE :code', { code: `%${searchParams.code}%` });
    }

    if (searchParams?.lowQuantity) {
      query.andWhere('material.currentQuantity <= material.alertQuantity');
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    const sortField = searchParams?.sortField ?? 'name';
    const sortOrder = searchParams?.sortOrder ?? 'ASC';
    this.supplierLoader.setSuppliersByMaterialOrder({ [sortField]: sortOrder });
    query.orderBy(`material.${sortField}`, sortOrder);

    const [materials, count] = await query.getManyAndCount();

    return {
      items: materials.map(material => mapMaterialEntityToMaterial(material)),
      paginationInfo: {
        count,
        pageNumber: pagination?.pageNumber ?? 1,
        pageSize: pagination?.pageSize ?? count,
      },
    };
  }

  @Query(() => Material)
  async material(@Args('materialId', { type: () => ID }) materialId: string): Promise<Material> {
    const material = await this.ds.manager.findOneByOrFail(MaterialEntity, { id: materialId });
    this.supplierLoader.setSuppliersByMaterialOrder({
      name: 'ASC',
      materialSuppliers: { supplier: { name: 'ASC' } },
    });

    return mapMaterialEntityToMaterial(material);
  }

  @Mutation(() => Material)
  async createMaterial(@Args('input') input: SaveMaterialInput): Promise<Material> {
    const data = saveMaterialSchema.parse(input);

    const materialWithSameCode = await this.ds.manager.findOneBy(MaterialEntity, {
      code: data.code,
    });

    if (materialWithSameCode) {
      throw new GraphQLError('CODE_TAKEN');
    }

    const suppliers = await this.ds.manager.findBy(SupplierEntity, { id: In(data.suppliers) });

    if (suppliers.length !== data.suppliers.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      const material = em.create<MaterialEntity>(MaterialEntity, {
        name: data.name,
        code: data.code,
        measureUnit: data.measureUnit,
        currentQuantity: data.currentQuantity,
        alertQuantity: data.alertQuantity,
      });
      await em.save(material);

      const materialSuppliers = suppliers.map(supplier => {
        return em.create<MaterialSupplierEntity>(MaterialSupplierEntity, { material, supplier });
      });
      await Promise.all(materialSuppliers.map(ms => em.save(ms)));

      return mapMaterialEntityToMaterial(material);
    });
  }

  // FIXME: @todo refactorizar. eliminar todos los suppliers del material y reasociarlo con los
  // suppliers recibidos
  @Mutation(() => Material)
  async updateMaterial(
    @Args('materialId', { type: () => ID }) materialId: string,
    @Args('input') input: SaveMaterialInput
  ): Promise<Material> {
    const data = saveMaterialSchema.parse(input);
    const material = await this.ds.manager.findOneByOrFail(MaterialEntity, { id: materialId });

    const materialWithSameCode = await this.ds.manager.findOneBy(MaterialEntity, {
      code: data.code,
    });

    if (materialWithSameCode && materialWithSameCode.id !== material.id) {
      throw new GraphQLError('CODE_TAKEN');
    }

    const suppliers = await this.ds.manager.findBy(SupplierEntity, { id: In(data.suppliers) });

    if (suppliers.length !== data.suppliers.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      material.name = data.name;
      material.code = data.code;
      material.measureUnit = data.measureUnit;
      material.currentQuantity = data.currentQuantity ?? null;
      material.alertQuantity = data.alertQuantity ?? null;
      await em.save(material);

      const materialSuppliers = await em.findBy(MaterialSupplierEntity, {
        materialId: material.id,
      });

      const operations = [];

      data.suppliers.forEach(supplierId => {
        const isAlreadySaved = materialSuppliers.some(ms => ms.supplierId === supplierId);

        if (!isAlreadySaved) {
          const materialSupplier = em.create<MaterialSupplierEntity>(MaterialSupplierEntity, {
            material,
            supplier: suppliers.find(supplier => supplier.id === supplierId) as SupplierEntity,
          });
          operations.push(em.save(materialSupplier));
        }
      });

      const toDelete = materialSuppliers.filter(ms => !data.suppliers.includes(ms.supplierId));
      operations.push(...toDelete.map(ms => em.remove(ms)));

      await Promise.all(operations);

      return mapMaterialEntityToMaterial(material);
    });
  }

  @Mutation(() => Boolean)
  async deleteMaterial(
    @Args('materialId', { type: () => ID }) materialId: string
  ): Promise<boolean> {
    await this.ds.manager.delete(MaterialEntity, { id: materialId });

    return true;
  }

  @Mutation(() => Boolean)
  async updateMaterialQuantity(
    @Args('input') input: UpdateMaterialQuantityInput
  ): Promise<boolean> {
    const parsedData = updateMaterialQuantitySchema.parse(input);

    const material = await this.ds.manager.findOneOrFail(MaterialEntity, {
      where: { id: parsedData.materialId, currentQuantity: Not(IsNull()) },
    });

    material.currentQuantity = input.quantity;
    await this.ds.manager.save(material);

    return true;
  }

  @ResolveField()
  suppliers(@Parent() parent: Material): Promise<Supplier[]> {
    return this.supplierLoader.loadSuppliersByMaterial(parent.id);
  }
}
