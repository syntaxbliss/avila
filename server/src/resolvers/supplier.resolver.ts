import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { SupplierEntity } from 'src/entities';
import {
  PaginationInput,
  SaveSupplierInput,
  SearchSupplierInput,
  saveSupplierSchema,
} from 'src/input-types';
import { mapSupplierEntityToSupplier } from 'src/mappers';
import { PaginatedSuppliers, Supplier } from 'src/object-types';
import { DataSource } from 'typeorm';

@Resolver(() => Supplier)
export default class SupplierResolver {
  constructor(private readonly ds: DataSource) {}

  @Query(() => PaginatedSuppliers)
  async suppliers(
    @Args('searchParams', { nullable: true }) searchParams?: SearchSupplierInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedSuppliers> {
    const query = this.ds.manager.createQueryBuilder(SupplierEntity, 'supplier');

    if (searchParams?.name) {
      query.where('supplier.name LIKE :name', { name: `%${searchParams.name}%` });
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    query.orderBy(`supplier.name`, searchParams?.sortOrder ?? 'ASC');

    const [suppliers, count] = await query.getManyAndCount();

    return {
      items: suppliers.map(supplier => mapSupplierEntityToSupplier(supplier)),
      paginationInfo: {
        count,
        pageNumber: pagination?.pageNumber ?? 1,
        pageSize: pagination?.pageSize ?? count,
      },
    };
  }

  @Query(() => Supplier)
  async supplier(@Args('supplierId', { type: () => ID }) supplierId: string): Promise<Supplier> {
    const supplier = await this.ds.manager.findOneByOrFail(SupplierEntity, { id: supplierId });

    return mapSupplierEntityToSupplier(supplier);
  }

  @Mutation(() => Supplier)
  async createSupplier(@Args('input') input: SaveSupplierInput): Promise<Supplier> {
    const data = saveSupplierSchema.parse(input);

    const supplier = this.ds.manager.create<SupplierEntity>(SupplierEntity, {
      name: data.name,
      address: data.address || null,
      email: data.email || null,
      phone: data.phone || null,
    });
    await this.ds.manager.save(SupplierEntity, supplier);

    return mapSupplierEntityToSupplier(supplier);
  }

  @Mutation(() => Supplier)
  async updateSupplier(
    @Args('supplierId', { type: () => ID }) supplierId: string,
    @Args('input') input: SaveSupplierInput
  ): Promise<Supplier> {
    const data = saveSupplierSchema.parse(input);

    const supplier = await this.ds.manager.findOneByOrFail(SupplierEntity, { id: supplierId });
    supplier.name = data.name;
    supplier.address = data.address || null;
    supplier.email = data.email || null;
    supplier.phone = data.phone || null;
    await this.ds.manager.save(SupplierEntity, supplier);

    return mapSupplierEntityToSupplier(supplier);
  }

  @Mutation(() => Boolean)
  async deleteSupplier(
    @Args('supplierId', { type: () => ID }) supplierId: string
  ): Promise<boolean> {
    return this.ds.transaction(async em => {
      const supplier = await em.findOne(SupplierEntity, {
        where: { id: supplierId },
        relations: { material_suppliers: true },
      });

      if (!supplier) {
        throw new GraphQLError('BAD_REQUEST');
      }

      await Promise.all(supplier.material_suppliers.map(m_s => em.softRemove(m_s)));
      await em.softRemove(supplier);

      return true;
    });
  }
}
