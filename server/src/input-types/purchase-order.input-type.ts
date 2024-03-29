import { Field, Float, ID, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { PaymentMethodEnum } from 'src/entities';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

@InputType()
export class PurchaseOrderMaterialInput {
  @Field(() => ID)
  materialId: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;
}
export const purchaseOrderMaterialSchema = z.object({
  materialId: z.string().trim().uuid(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
});

@InputType()
export class PurchaseOrderPaymentInput {
  @Field(() => PaymentMethodEnum)
  method: PaymentMethodEnum;

  @Field(() => Float)
  amount: number;

  @Field(() => Date)
  paidAt: Date;

  @Field(() => String, { nullable: true })
  notes: string | null;
}
export const purchaseOrderPaymentSchema = z.object({
  method: z.nativeEnum(PaymentMethodEnum),
  amount: z.number().positive(),
  paidAt: z.date(),
  notes: z.string().trim().max(1500).optional(),
});

@InputType()
export class CreatePurchaseOrderInput {
  @Field(() => String)
  emitter: string;

  @Field(() => String, { nullable: true })
  deliveryLocation: string | null;

  @Field(() => String, { nullable: true })
  conditions: string | null;

  @Field(() => Date)
  orderedAt: Date;

  @Field(() => Date, { nullable: true })
  deliveredAt: Date | null;

  @Field(() => String, { nullable: true })
  deliveryNote: string | null;

  @Field(() => ID)
  supplierId: string;

  @Field(() => Boolean)
  updateStock: boolean;

  @Field(() => [PurchaseOrderMaterialInput])
  materials: PurchaseOrderMaterialInput[];

  @Field(() => [PurchaseOrderPaymentInput], { nullable: true })
  payments: PurchaseOrderPaymentInput[] | null;

  @Field(() => ID, { nullable: true })
  requestForQuotationId: string | null;
}
export const createPurchaseorderSchema = z.object({
  emitter: z.string().trim().min(1).max(250),
  deliveryLocation: z.string().trim().max(250).optional(),
  conditions: z.string().trim().max(250).optional(),
  orderedAt: z.date(),
  deliveredAt: z.date().optional(),
  deliveryNote: z.string().trim().max(100).optional(),
  supplierId: z.string().trim().uuid(),
  updateStock: z.boolean(),
  materials: z.array(purchaseOrderMaterialSchema).min(1),
  payments: z.array(purchaseOrderPaymentSchema).optional(),
  requestForQuotationId: z.string().trim().uuid().optional(),
});

export enum SearchPurchaseOrderPaymentStatusEnum {
  ALL = 'all',
  PAID = 'paid',
  UNPAID = 'unpaid',
}
registerEnumType(SearchPurchaseOrderPaymentStatusEnum, {
  name: 'SearchPurchaseOrderPaymentStatus',
});

export enum SearchPurchaseOrderDeliveryStatusEnum {
  ALL = 'all',
  DELIVERED = 'delivered',
  UNDELIVERED = 'undelivered',
}
registerEnumType(SearchPurchaseOrderDeliveryStatusEnum, {
  name: 'SearchPurchaseOrderDeliveryStatus',
});

enum SearchPurchaseOrderQuerySortFieldEnum {
  ORDERED_AT = 'orderedAt',
  DELIVERED_AT = 'deliveredAt',
}
registerEnumType(SearchPurchaseOrderQuerySortFieldEnum, {
  name: 'SearchPurchaseOrderQuerySortField',
});

@InputType()
export class SearchPurchaseOrderInput {
  @Field(() => Int, { nullable: true })
  orderNumber: number | null;

  @Field(() => Date, { nullable: true })
  orderedAtFrom: Date | null;

  @Field(() => Date, { nullable: true })
  orderedAtTo: Date | null;

  @Field(() => ID, { nullable: true })
  supplierId: string | null;

  @Field(() => SearchPurchaseOrderPaymentStatusEnum, { nullable: true })
  paymentStatus: SearchPurchaseOrderPaymentStatusEnum | null;

  @Field(() => SearchPurchaseOrderDeliveryStatusEnum, { nullable: true })
  deliveryStatus: SearchPurchaseOrderDeliveryStatusEnum | null;

  @Field(() => SearchPurchaseOrderQuerySortFieldEnum, { nullable: true })
  sortField: SearchPurchaseOrderQuerySortFieldEnum | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}

@InputType()
export class PurchaseOrderDeliveredInput {
  @Field(() => Date)
  deliveredAt: Date;

  @Field(() => String, { nullable: true })
  deliveryNote: string | null;

  @Field(() => Boolean)
  updateStock: boolean;
}
export const purchaseOrderDeliveredSchema = z.object({
  deliveredAt: z.date(),
  deliveryNote: z.string().trim().optional(),
  updateStock: z.boolean(),
});
