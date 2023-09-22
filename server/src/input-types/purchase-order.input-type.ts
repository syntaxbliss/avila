import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { PurchaseOrderPaymentMethodEnum } from 'src/entities';
import { z } from 'zod';

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
  @Field(() => PurchaseOrderPaymentMethodEnum)
  method: PurchaseOrderPaymentMethodEnum;

  @Field(() => Float)
  amount: number;

  @Field(() => Date)
  paidAt: Date;

  @Field(() => String, { nullable: true })
  notes: string | null;
}
export const purchaseOrderPaymentSchema = z.object({
  method: z.nativeEnum(PurchaseOrderPaymentMethodEnum),
  amount: z.number().positive(),
  paidAt: z.date(),
  notes: z.string().trim().max(1500).optional(),
});

@InputType()
export class CreatePurchaseOrderInput {
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
}
export const createPurchaseorderSchema = z.object({
  orderedAt: z.date(),
  deliveredAt: z.date().optional(),
  deliveryNote: z.string().trim().optional(),
  supplierId: z.string().trim().uuid(),
  updateStock: z.boolean(),
  materials: z.array(purchaseOrderMaterialSchema).min(1),
  payments: z.array(purchaseOrderPaymentSchema).optional(),
});
