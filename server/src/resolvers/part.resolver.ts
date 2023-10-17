import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  MaterialEntity,
  PartEntity,
  PartMaterialEntity,
  PricedItemElementTypeEnum,
  PricedItemEntity,
} from 'src/entities';
import { PaginationInput, SavePartInput, SearchPartInput, savePartSchema } from 'src/input-types';
import { PartMaterialLoader } from 'src/loaders';
import { mapPartEntityToPart } from 'src/mappers';
import { PaginatedParts, Part, PartMaterial } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => Part)
export default class PartResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly partMaterialLoader: PartMaterialLoader
  ) {}

  @Query(() => PaginatedParts)
  async parts(
    @Args('searchParams', { nullable: true }) searchParams?: SearchPartInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedParts> {
    const query = this.ds.manager.createQueryBuilder(PartEntity, 'part');

    if (searchParams?.name) {
      query.where('part.name LIKE :name', { name: `%${searchParams.name}%` });
    }

    if (searchParams?.code) {
      query.andWhere('part.code LIKE :code', { code: `%${searchParams.code}%` });
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    const sortField = searchParams?.sortField ?? 'name';
    const sortOrder = searchParams?.sortOrder ?? 'ASC';
    this.partMaterialLoader.setPartMaterialsByPartOrder({
      [sortField]: sortOrder,
      materials: { material: { name: 'ASC' } },
    });
    query.orderBy(`part.${sortField}`, sortOrder);

    const [parts, count] = await query.getManyAndCount();

    return {
      items: parts.map(part => mapPartEntityToPart(part)),
      paginationInfo: {
        count,
        pageNumber: pagination?.pageNumber ?? 1,
        pageSize: pagination?.pageSize ?? count,
      },
    };
  }

  @Query(() => Part)
  async part(@Args('partId', { type: () => ID }) partId: string): Promise<Part> {
    const part = await this.ds.manager.findOneByOrFail(PartEntity, { id: partId });
    this.partMaterialLoader.setPartMaterialsByPartOrder({
      name: 'ASC',
      materials: { material: { name: 'ASC' } },
    });

    return mapPartEntityToPart(part);
  }

  @Mutation(() => Part)
  async createPart(@Args('input') input: SavePartInput): Promise<Part> {
    const parsedData = savePartSchema.parse(input);

    const partWithSameCode = await this.ds.manager.findOneBy(PartEntity, { code: parsedData.code });

    if (partWithSameCode) {
      throw new GraphQLError('CODE_TAKEN');
    }

    const materials = await this.ds.manager.find(MaterialEntity, {
      where: { id: In(parsedData.materials.map(m => m.materialId)) },
    });

    if (materials.length !== parsedData.materials.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      // part
      const part = em.create<PartEntity>(PartEntity, {
        name: parsedData.name,
        code: parsedData.code,
      });
      await em.save(part);

      // materials
      const partMaterials = parsedData.materials.map(pm => {
        const partMaterial = em.create<PartMaterialEntity>(PartMaterialEntity, {
          part,
          materialId: pm.materialId,
          quantity: pm.quantity,
        });

        return em.save(partMaterial);
      });
      await Promise.all(partMaterials);

      const pricedItem = em.create<PricedItemEntity>(PricedItemEntity, {
        elementType: PricedItemElementTypeEnum.PART,
        part,
      });
      await em.save(pricedItem);

      return mapPartEntityToPart(part);
    });
  }

  @Mutation(() => Part)
  async updatePart(
    @Args('partId', { type: () => ID }) partId: string,
    @Args('input') input: SavePartInput
  ): Promise<Part> {
    const parsedData = savePartSchema.parse(input);
    const part = await this.ds.manager.findOneByOrFail(PartEntity, { id: partId });

    const partWithSameCode = await this.ds.manager.findOneBy(PartEntity, { code: parsedData.code });

    if (partWithSameCode && partWithSameCode.id !== part.id) {
      throw new GraphQLError('CODE_TAKEN');
    }

    const materials = await this.ds.manager.findBy(MaterialEntity, {
      id: In(parsedData.materials.map(m => m.materialId)),
    });

    if (materials.length !== parsedData.materials.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      // part
      part.name = parsedData.name;
      part.code = parsedData.code;
      await em.save(part);

      // materials
      const partMaterials = await em.findBy(PartMaterialEntity, { partId });
      const operations = [];

      parsedData.materials.forEach(material => {
        const alreadySavedPartMaterial = partMaterials.find(
          pm => pm.materialId === material.materialId
        );

        if (alreadySavedPartMaterial) {
          alreadySavedPartMaterial.quantity = material.quantity;
          operations.push(em.save(alreadySavedPartMaterial));
        } else {
          const newPartMaterial = em.create<PartMaterialEntity>(PartMaterialEntity, {
            part,
            materialId: material.materialId,
            quantity: material.quantity,
          });
          operations.push(em.save(newPartMaterial));
        }
      });

      const toDelete = partMaterials.filter(
        pm => !parsedData.materials.some(m => m.materialId === pm.materialId)
      );
      operations.push(...toDelete.map(pm => em.remove(pm)));

      await Promise.all(operations);

      return mapPartEntityToPart(part);
    });
  }

  @Mutation(() => Boolean)
  async deletePart(@Args('partId', { type: () => ID }) partId: string): Promise<boolean> {
    await this.ds.manager.delete(PartEntity, { id: partId });

    return true;
  }

  @ResolveField()
  async materials(@Parent() parent: Part): Promise<PartMaterial[]> {
    return this.partMaterialLoader.loadPartMaterialsByPart(parent.id);
  }
}
