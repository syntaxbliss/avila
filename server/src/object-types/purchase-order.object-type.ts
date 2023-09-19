import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Supplier } from './supplier.object-type';
import { PurchaseOrderMaterial } from './purchase-order-material.object-type';

@ObjectType()
export class PurchaseOrder {
  @Field(() => ID)
  id: string;

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
}
