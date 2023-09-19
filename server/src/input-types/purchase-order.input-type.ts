import { Field, Float, ID, InputType } from '@nestjs/graphql';
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
export class CreatePurchaseOrderInput {
  @Field(() => Date)
  orderedAt: Date;

  @Field(() => Date, { nullable: true })
  deliveredAt: Date | null;

  @Field(() => String, { nullable: true })
  deliveryNote: string | null;

  @Field(() => ID)
  supplierId: string;

  @Field(() => [PurchaseOrderMaterialInput])
  materials: PurchaseOrderMaterialInput[];
}
export const createPurchaseorderSchema = z.object({
  orderedAt: z.date(),
  deliveredAt: z.date().optional(),
  deliveryNote: z.string().trim().optional(),
  supplierId: z.string().trim().uuid(),
  materials: z.array(purchaseOrderMaterialSchema).min(1),
});
