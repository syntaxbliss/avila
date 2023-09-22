import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  Material_SupplierEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
} from 'src/entities';
import { CreatePurchaseOrderInput, createPurchaseorderSchema } from 'src/input-types';
import { PurchaseOrderMaterialLoader, SupplierLoader } from 'src/loaders';
import { mapPurchaseOrderEntityToPurchaseOrder } from 'src/mappers';
import { PurchaseOrder, PurchaseOrderMaterial, Supplier } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => PurchaseOrder)
export default class PurchaseOrderResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly supplierLoader: SupplierLoader,
    private readonly purchaseOrderMaterialLoader: PurchaseOrderMaterialLoader
  ) {}

  // FIXME
  @Query(() => [PurchaseOrder])
  async puchaseOrdersTest(): Promise<PurchaseOrder[]> {
    const purchaseOrders = await this.ds.manager.find(PurchaseOrderEntity);

    return purchaseOrders.map(po => mapPurchaseOrderEntityToPurchaseOrder(po));
  }
  // END OF FIXME

  @Mutation(() => PurchaseOrder)
  async createPurchaseOrder(
    @Args('input') input: CreatePurchaseOrderInput
  ): Promise<PurchaseOrder> {
    const parsedData = createPurchaseorderSchema.parse(input);

    return this.ds.transaction(async em => {
      // purchase order
      const purchaseOrder = em.create<PurchaseOrderEntity>(PurchaseOrderEntity, {
        orderedAt: parsedData.orderedAt,
        deliveredAt: parsedData.deliveredAt ?? null,
        deliveryNote: parsedData.deliveryNote ?? null,
        totalAmount: parsedData.materials.reduce((acc, material) => {
          acc += material.quantity * material.unitPrice;

          return acc;
        }, 0),
        // FIXME: @todo purchase order payments
        paidAmount: 0,
      });
      await em.save(purchaseOrder);

      // materials
      const materialsIds = parsedData.materials.map(material => material.materialId);
      const material_suppliers = await em.find(Material_SupplierEntity, {
        where: { supplierId: parsedData.supplierId, materialId: In(materialsIds) },
      });

      if (material_suppliers.length !== materialsIds.length) {
        throw new GraphQLError('BAD_REQUEST');
      }

      const purchaseOrderMaterials = parsedData.materials.map(material => {
        return em.create<PurchaseOrderMaterialEntity>(PurchaseOrderMaterialEntity, {
          purchaseOrder,
          material_supplier: material_suppliers.find(
            m_s => m_s.materialId === material.materialId
          ) as Material_SupplierEntity,
          quantity: material.quantity,
          unitPrice: material.unitPrice,
        });
      });
      await Promise.all(purchaseOrderMaterials.map(pom => em.save(pom)));

      return mapPurchaseOrderEntityToPurchaseOrder(purchaseOrder);
    });
  }

  @ResolveField()
  async supplier(@Parent() parent: PurchaseOrder): Promise<Supplier> {
    return this.supplierLoader.loadSupplierByPurchaseOrder(parent.id);
  }

  @ResolveField()
  async materials(@Parent() parent: PurchaseOrder): Promise<PurchaseOrderMaterial[]> {
    return this.purchaseOrderMaterialLoader.loadPurchaseOrderMaterialsByPurchaseOrder(parent.id);
  }
}
