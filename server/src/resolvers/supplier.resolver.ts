import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SupplierEntity } from 'src/entities';
import { SaveSupplierInput, saveSupplierSchema } from 'src/input-types';
import { Supplier } from 'src/object-types';
import { DataSource } from 'typeorm';

@Resolver(() => Supplier)
export default class SupplierResolver {
  constructor(private readonly ds: DataSource) {}

  private mapSupplierEntityToSupplier(entity: SupplierEntity): Supplier {
    const supplier = new Supplier();
    supplier.id = entity.id;
    supplier.name = entity.name;
    supplier.address = entity.address;
    supplier.email = entity.email;
    supplier.phone = entity.phone;
    supplier.deletedAt = entity.deletedAt;

    return supplier;
  }

  @Query(() => [Supplier])
  async suppliers(): Promise<Supplier[]> {
    const suppliers = await this.ds.manager.find(SupplierEntity, { order: { name: 'ASC' } });

    return suppliers.map(supplier => this.mapSupplierEntityToSupplier(supplier));
  }

  @Query(() => Supplier)
  async supplier(@Args('supplierId', { type: () => ID }) supplierId: string): Promise<Supplier> {
    const supplier = await this.ds.manager.findOneByOrFail(SupplierEntity, { id: supplierId });

    return this.mapSupplierEntityToSupplier(supplier);
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

    return this.mapSupplierEntityToSupplier(supplier);
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

    return this.mapSupplierEntityToSupplier(supplier);
  }
}
