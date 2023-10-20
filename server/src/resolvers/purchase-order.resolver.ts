import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as dayjs from 'dayjs';
import { GraphQLError } from 'graphql';
import * as _ from 'lodash';
import {
  ConfigurationEntity,
  MaterialEntity,
  MaterialSupplierEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  PurchaseOrderPaymentEntity,
  RequestForQuotationEntity,
} from 'src/entities';
import {
  CreatePurchaseOrderInput,
  PaginationInput,
  PurchaseOrderDeliveredInput,
  PurchaseOrderPaymentInput,
  SearchPurchaseOrderDeliveryStatusEnum,
  SearchPurchaseOrderInput,
  SearchPurchaseOrderPaymentStatusEnum,
  createPurchaseorderSchema,
  purchaseOrderDeliveredSchema,
  purchaseOrderPaymentSchema,
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
import { DataSource, FindOneOptions, In, IsNull, Not } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { PDFService } from 'src/services';

@Resolver(() => PurchaseOrder)
export default class PurchaseOrderResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly supplierLoader: SupplierLoader,
    private readonly purchaseOrderMaterialLoader: PurchaseOrderMaterialLoader,
    private readonly purchaseOrderPaymentLoader: PurchaseOrderPaymentLoader,
    private readonly pdfService: PDFService
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
        .innerJoin('purchase_order_material.materialSupplier', 'material_supplier')
        .andWhere('material_supplier.supplierId = :supplierId', {
          supplierId: searchParams.supplierId,
        })
        .groupBy('purchase_order.id');
    }

    if (searchParams?.paymentStatus === SearchPurchaseOrderPaymentStatusEnum.PAID) {
      query.andWhere('purchase_order.paidAmount = purchase_order.totalAmount');
    } else if (searchParams?.paymentStatus === SearchPurchaseOrderPaymentStatusEnum.UNPAID) {
      query.andWhere('purchase_order.paidAmount < purchase_order.totalAmount');
    }

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
    this.supplierLoader.setSupplierByPurchaseOrderOrder({ [sortField]: sortOrder });
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

    const requestForQuotation = parsedData.requestForQuotationId
      ? await this.ds.manager.findOneByOrFail(RequestForQuotationEntity, {
          id: parsedData.requestForQuotationId,
        })
      : null;

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
      const materialSuppliers = await em.find(MaterialSupplierEntity, {
        where: { supplierId: parsedData.supplierId, materialId: In(materialsIds) },
      });

      if (materialSuppliers.length !== materialsIds.length) {
        throw new GraphQLError('BAD_REQUEST');
      }

      const purchaseOrderMaterials = parsedData.materials.map(material => {
        return em.create<PurchaseOrderMaterialEntity>(PurchaseOrderMaterialEntity, {
          purchaseOrder,
          materialSupplier: materialSuppliers.find(
            ms => ms.materialId === material.materialId
          ) as MaterialSupplierEntity,
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

      // update stock values
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

      // request for quotation association
      if (requestForQuotation) {
        requestForQuotation.purchaseOrder = purchaseOrder;
        await em.save(requestForQuotation);
      }

      return mapPurchaseOrderEntityToPurchaseOrder(purchaseOrder);
    });
  }

  @Mutation(() => Boolean)
  async deletePurchaseOrder(
    @Args('purchaseOrderId', { type: () => ID }) purchaseOrderId: string
  ): Promise<boolean> {
    await this.ds.manager.delete(PurchaseOrderEntity, { id: purchaseOrderId });

    return true;
  }

  @Mutation(() => Boolean)
  async purchaseOrderDelivered(
    @Args('purchaseOrderId', { type: () => ID }) purchaseOrderId: string,
    @Args('input') input: PurchaseOrderDeliveredInput
  ): Promise<boolean> {
    const parsedData = purchaseOrderDeliveredSchema.parse(input);
    const findOptions: FindOneOptions<PurchaseOrderEntity> = {
      where: {
        id: purchaseOrderId,
        deliveredAt: IsNull(),
      },
    };

    if (parsedData.updateStock) {
      findOptions.relations = { materials: { materialSupplier: { material: true } } };
    }

    const purchaseOrder = await this.ds.manager.findOneOrFail(PurchaseOrderEntity, findOptions);

    return this.ds.transaction(async em => {
      // purchase order
      purchaseOrder.deliveredAt = parsedData.deliveredAt;
      purchaseOrder.deliveryNote = parsedData.deliveryNote || null;
      await em.save(purchaseOrder);

      // update stock values
      if (parsedData.updateStock) {
        const updatedMaterials = purchaseOrder.materials.reduce((acc, pom) => {
          const { material } = pom.materialSupplier;

          if (!_.isNull(material.currentQuantity)) {
            const newCurrentQuantity =
              parseFloat(String(material.currentQuantity)) + parseFloat(String(pom.quantity));
            material.currentQuantity = newCurrentQuantity;

            acc.push(material);
          }

          return acc;
        }, [] as MaterialEntity[]);
        await Promise.all(updatedMaterials.map(um => em.save(um)));
      }

      return true;
    });
  }

  @Mutation(() => Boolean)
  async registerPurchaseOrderPayment(
    @Args('purchaseOrderId', { type: () => ID }) purchaseOrderId: string,
    @Args('input') input: PurchaseOrderPaymentInput
  ): Promise<boolean> {
    const parsedData = purchaseOrderPaymentSchema.parse(input);
    const purchaseOrder = await this.ds.manager.findOneOrFail(PurchaseOrderEntity, {
      where: { id: purchaseOrderId },
    });

    return this.ds.transaction(async em => {
      // purchase order
      const newPaidAmount = parseFloat(String(purchaseOrder.paidAmount)) + parsedData.amount;
      purchaseOrder.paidAmount = newPaidAmount;

      if (newPaidAmount > parseFloat(String(purchaseOrder.totalAmount))) {
        throw new GraphQLError('BAD_REQUEST');
      }

      await em.save(purchaseOrder);

      // payments
      const purcahseOrderPayment = em.create(PurchaseOrderPaymentEntity, {
        purchaseOrder,
        amount: parsedData.amount,
        method: parsedData.method,
        paidAt: parsedData.paidAt,
        notes: parsedData.notes || null,
      });
      await em.save(purcahseOrderPayment);

      return true;
    });
  }

  @Mutation(() => String)
  async printPurchaseOrder(
    @Args('purchaseOrderId', { type: () => ID }) purchaseOrderId: string
  ): Promise<string> {
    const purchaseOrder = await this.ds.manager.findOneOrFail(PurchaseOrderEntity, {
      where: { id: purchaseOrderId },
      relations: { materials: { materialSupplier: { supplier: true, material: true } } },
      order: { materials: { materialSupplier: { material: { name: 'ASC' } } } },
    });
    const configuration = await this.ds.manager.find(ConfigurationEntity);
    const config = configuration.reduce((obj, param) => {
      obj[param.parameter] = param.value;

      return obj;
    }, {} as Record<string, string>);

    // copy template
    const baseDir = path.join(__dirname, '..', 'assets', 'purchase-order');
    const outputDir = path.join(__dirname, '..', 'assets', 'download');
    const templateFilename = 'template.html';
    const outputHtmlFilename = `orden-de-compra-${dayjs().format('YYYY_MM_DD_HH_mm_ss')}`;

    // fill content
    const { supplier } = purchaseOrder.materials[0].materialSupplier;
    let content = fs
      .readFileSync(path.join(baseDir, templateFilename), 'utf8')
      .replace(/{{COMPANY_NAME}}/g, config.COMPANY_NAME)
      .replace(/{{COMPANY_ADDRESS}}/g, config.COMPANY_ADDRESS)
      .replace(/{{TAX_CONDITION}}/g, config.TAX_CONDITION)
      .replace(/{{NRO_DE_CUIT}}/g, config.NRO_DE_CUIT)
      .replace(/{{NRO_DE_INGRESOS_BRUTOS}}/g, config.NRO_DE_INGRESOS_BRUTOS)
      .replace(/{{COMPANY_PHONE}}/g, config.COMPANY_PHONE)
      .replace(/{{COMPANY_EMAIL}}/g, config.COMPANY_EMAIL)
      .replace(/{{SUPPLIER_NAME}}/g, supplier.name)
      .replace(/{{SUPPLIER_ADDRESS}}/g, supplier.address ?? '')
      .replace(/{{SUPPLIER_EMAIL}}/g, supplier.email ?? '')
      .replace(/{{SUPPLIER_PHONE}}/g, supplier.phone ?? '')
      .replace(/{{PURCHASE_ORDER_DATE}}/g, dayjs(purchaseOrder.orderedAt).format('DD/MM/YYYY'));

    const articleRowTemplate = `
      <tr class="border-left border-right border-top-soft">
        <td>{{ARTICLE_ROW_NAME}}</td>
        <td class="text-center">{{ARTICLE_ROW_MEASUTE_UNIT}}</td>
        <td class="text-center">{{ARTICLE_ROW_QUANTITY}}</td>
        <td class="text-right">$ {{ARTICLE_ROW_UNIT_PRICE}}</td>
        <td class="text-right">$ {{ARTICLE_ROW_SUBTOTAL}}</td>
        <td class="text-center">{{ARTICLE_ROW_IVA}}%</td>
        <td class="text-right">$ {{ARTICLE_ROW_FINAL_PRICE}}</td>
      </tr>
    `;

    let total = 0;
    const iva = 21;

    const articles = purchaseOrder.materials.map(material => {
      const quantity = material.quantity as number;
      const unitPrice = material.unitPrice as number;
      const subtotal = quantity * unitPrice;
      const finalPrice = subtotal * (1 + iva / 100);

      total += finalPrice;

      return articleRowTemplate
        .replace(/{{ARTICLE_ROW_NAME}}/g, material.materialSupplier.material.name)
        .replace(/{{ARTICLE_ROW_MEASUTE_UNIT}}/g, material.materialSupplier.material.measureUnit)
        .replace(/{{ARTICLE_ROW_QUANTITY}}/g, material.quantity.toString())
        .replace(/{{ARTICLE_ROW_UNIT_PRICE}}/g, material.unitPrice.toString())
        .replace(/{{ARTICLE_ROW_SUBTOTAL}}/g, subtotal.toFixed(2))
        .replace(/{{ARTICLE_ROW_IVA}}/g, iva.toFixed(2))
        .replace(/{{ARTICLE_ROW_FINAL_PRICE}}/g, finalPrice.toFixed(2));
    });
    content = content
      .replace(/{{ARTICLE_ROWS}}/g, articles.join(''))
      .replace(/{{PURCHASE_ORDER_TOTAL}}/g, total.toFixed(2));

    fs.writeFileSync(path.join(outputDir, `${outputHtmlFilename}.html`), content, 'utf-8');

    // generate pdf
    return this.pdfService.generatePDF(outputHtmlFilename);
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
