import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Supplier } from './supplier.object-type';
import { PurchaseOrderMaterial } from './purchase-order-material.object-type';
import { PurchaseOrderPayment } from './purchase-order-payment.object-type';
import { PaginatedResponse } from './commons';

@ObjectType()
export class PurchaseOrder {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  orderNumber: number;

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

  @Field(() => Number)
  totalAmount: number;

  @Field(() => Number)
  paidAmount: number;

  @Field(() => Supplier)
  supplier: Supplier;

  @Field(() => [PurchaseOrderMaterial])
  materials: PurchaseOrderMaterial[];

  @Field(() => [PurchaseOrderPayment], { nullable: true })
  payments: PurchaseOrderPayment[] | null;
}

@ObjectType()
export class PaginatedPurchaseOrders extends PaginatedResponse(PurchaseOrder) {}
