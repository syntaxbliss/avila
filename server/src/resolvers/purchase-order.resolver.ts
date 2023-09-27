import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as dayjs from 'dayjs';
import { GraphQLError } from 'graphql';
import {
  MaterialEntity,
  Material_SupplierEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  PurchaseOrderPaymentEntity,
  PurchaseOrderStatusEnum,
} from 'src/entities';
import {
  CreatePurchaseOrderInput,
  PaginationInput,
  SearchPurchaseOrderDeliveryStatusEnum,
  SearchPurchaseOrderInput,
  SearchPurchaseOrderPaymentStatusEnum,
  createPurchaseorderSchema,
} from 'src/input-types';
import {
  PurchaseOrderMaterialLoader,
  PurchaseOrderPaymentLoader,
  SupplierLoader,
} from 'src/loaders';
import { mapPurchaseOrderEntityToPurchaseOrder } from 'src/mappers';
import {
  PaginatedPurchaseOrders,
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

  @Query(() => PaginatedPurchaseOrders)
  async purchaseOrders(
    @Args('searchParams', { nullable: true }) searchParams?: SearchPurchaseOrderInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedPurchaseOrders> {
    const query = this.ds.manager.createQueryBuilder(PurchaseOrderEntity, 'purchase_order');

    if (searchParams?.orderedAtFrom && searchParams?.orderedAtTo) {
      query.where('purchase_order.orderedAt BETWEEN :from AND :to', {
        from: dayjs(searchParams.orderedAtFrom).format('YYYY-MM-DD'),
        to: dayjs(searchParams.orderedAtTo).format('YYYY-MM-DD'),
      });
    } else if (searchParams?.orderedAtFrom) {
      query.where('purchase_order.orderedAt >= :from', {
        from: dayjs(searchParams.orderedAtFrom).format('YYYY-MM-DD'),
      });
    } else if (searchParams?.orderedAtTo) {
      query.where('purchase_order.orderedAt <= :to', {
        to: dayjs(searchParams.orderedAtTo).format('YYYY-MM-DD'),
      });
    }

    if (searchParams?.supplierId) {
      query
        .innerJoin('purchase_order.materials', 'purchase_order_material')
        .withDeleted()
        .innerJoin('purchase_order_material.material_supplier', 'material__supplier')
        .andWhere('material__supplier.supplierId = :supplierId', {
          supplierId: searchParams.supplierId,
        })
        .groupBy('purchase_order.id');
    }

    if (searchParams?.paymentStatus === SearchPurchaseOrderPaymentStatusEnum.PAID) {
      query.andWhere('purchase_order.paidAmount = purchase_order.totalAmount');
    } else if (searchParams?.paymentStatus === SearchPurchaseOrderPaymentStatusEnum.UNPAID) {
      query.andWhere('purchase_order.paidAmount < purchase_order.totalAmount');
    }

    query.andWhere('purchase_order.status = :status', {
      status: searchParams?.status ?? PurchaseOrderStatusEnum.ACTIVE,
    });

    if (searchParams?.deliveryStatus === SearchPurchaseOrderDeliveryStatusEnum.DELIVERED) {
      query.andWhere('purchase_order.deliveredAt IS NOT NULL');
    } else if (searchParams?.deliveryStatus === SearchPurchaseOrderDeliveryStatusEnum.UNDELIVERED) {
      query.andWhere('purchase_order.deliveredAt IS NULL');
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    const sortField = searchParams?.sortField ?? 'orderedAt';
    const sortOrder = searchParams?.sortOrder ?? 'DESC';
    this.supplierLoader.setSupplierByPurchaseOrderOrder({ [sortField]: sortOrder }, true);
    this.purchaseOrderMaterialLoader.setPurchaseOrderMaterialsByPurchaseOrderOrder(true);
    query.orderBy(`purchase_order.${sortField}`, sortOrder);

    const [purchaseOrders, count] = await query.getManyAndCount();

    return {
      items: purchaseOrders.map(purchaseOrder =>
        mapPurchaseOrderEntityToPurchaseOrder(purchaseOrder)
      ),
      paginationInfo: {
        count,
        pageNumber: pagination?.pageNumber ?? 1,
        pageSize: pagination?.pageSize ?? count,
      },
    };
  }

  @Query(() => PurchaseOrder)
  async purchaseOrder(@Args('purchaseOrderId', { type: () => ID }) purchaseOrderId: string) {
    const purchaseOrder = await this.ds.manager.findOneByOrFail(PurchaseOrderEntity, {
      id: purchaseOrderId,
    });

    return mapPurchaseOrderEntityToPurchaseOrder(purchaseOrder);
  }

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

  @Mutation(() => Boolean)
  async cancelPurchaseOrder(
    @Args('purchaseOrderId', { type: () => ID }) purchaseOrderId: string
  ): Promise<boolean> {
    const purchaseOrder = await this.ds.manager.findOneByOrFail(PurchaseOrderEntity, {
      id: purchaseOrderId,
    });

    purchaseOrder.status = PurchaseOrderStatusEnum.CANCELLED;
    await this.ds.manager.save(purchaseOrder);

    return true;
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