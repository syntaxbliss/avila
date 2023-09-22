import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  MaterialEntity,
  Material_SupplierEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  PurchaseOrderPaymentEntity,
} from 'src/entities';
import { CreatePurchaseOrderInput, createPurchaseorderSchema } from 'src/input-types';
import {
  PurchaseOrderMaterialLoader,
  PurchaseOrderPaymentLoader,
  SupplierLoader,
} from 'src/loaders';
import { mapPurchaseOrderEntityToPurchaseOrder } from 'src/mappers';
import {
  PurchaseOrder,
  PurchaseOrderMaterial,
  PurchaseOrderPayment,
  Supplier,
} from 'src/object-types';
import { DataSource, In, IsNull, Not } from 'typeorm';

@Resolver(() => PurchaseOrder)
export default class PurchaseOrderResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly supplierLoader: SupplierLoader,
    private readonly purchaseOrderMaterialLoader: PurchaseOrderMaterialLoader,
    private readonly purchaseOrderPaymentLoader: PurchaseOrderPaymentLoader
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
        totalAmount: parsedData.materials.reduce((sum, material) => {
          sum += material.quantity * material.unitPrice;

          return sum;
        }, 0),
        paidAmount: (parsedData.payments ?? []).reduce((sum, payment) => {
          sum += payment.amount;

          return sum;
        }, 0),
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

      // payments
      if (parsedData.payments?.length) {
        const purchaseOrderPayments = parsedData.payments.map(payment => {
          return em.create<PurchaseOrderPaymentEntity>(PurchaseOrderPaymentEntity, {
            purchaseOrder,
            method: payment.method,
            amount: payment.amount,
            paidAt: payment.paidAt,
            notes: payment.notes ?? null,
          });
        });
        await Promise.all(purchaseOrderPayments.map(pop => em.save(pop)));
      }

      // update stock values if the order has been flagged as delivered
      if (parsedData.updateStock && parsedData.deliveredAt) {
        const materialsToUpdate = await em.find(MaterialEntity, {
          where: {
            id: In(materialsIds),
            currentQuantity: Not(IsNull()),
            alertQuantity: Not(IsNull()),
          },
        });

        const updatedMaterials = materialsToUpdate.map(
          (material: MaterialEntity & { currentQuantity: number }) => {
            const receivedMaterial = parsedData.materials.find(
              m => m.materialId === material.id
            ) as (typeof parsedData.materials)[number];
            const newCurrentQuantity =
              parseFloat(String(material.currentQuantity)) + receivedMaterial.quantity;
            material.currentQuantity = newCurrentQuantity;

            return material;
          }
        );
        await Promise.all(updatedMaterials.map(um => em.save(um)));
      }

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

  @ResolveField()
  async payments(@Parent() parent: PurchaseOrder): Promise<PurchaseOrderPayment[] | null> {
    return this.purchaseOrderPaymentLoader.loadPurchaseOrderPaymentsByPurchaseOrder(parent.id);
  }
}
