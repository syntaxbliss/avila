import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { PaymentMethodEnum } from 'src/entities';
import { z } from 'zod';

@InputType()
export class RequestForQuotationMaterialInput {
  @Field(() => ID)
  materialId: string;

  @Field(() => Float)
  quantity: number;
}
export const requestForQuotationMaterialSchema = z.object({
  materialId: z.string().trim().uuid(),
  quantity: z.number().positive(),
});

@InputType()
export class CreateRequestForQuotationInput {
  @Field(() => Date)
  orderedAt: Date;

  @Field(() => ID)
  supplierId: string;

  @Field(() => [RequestForQuotationMaterialInput])
  materials: RequestForQuotationMaterialInput[];

  @Field(() => PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;
}
export const createRequestForQuotationSchema = z.object({
  orderedAt: z.date(),
  supplierId: z.string().trim().uuid(),
  materials: z.array(requestForQuotationMaterialSchema).min(1),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
});
