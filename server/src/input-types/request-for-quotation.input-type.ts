import { Field, Float, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { PaymentMethodEnum } from 'src/entities';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

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

export enum SearchRequestForQuotationStatusEnum {
  ALL = 'all',
  ANSWERED = 'answered',
  UNANSWERED = 'unanswered',
}
registerEnumType(SearchRequestForQuotationStatusEnum, {
  name: 'SearchRequestForQuotationStatus',
});

@InputType()
export class SearchRequestForQuotationInput {
  @Field(() => Date, { nullable: true })
  orderedAtFrom: Date | null;

  @Field(() => Date, { nullable: true })
  orderedAtTo: Date | null;

  @Field(() => ID, { nullable: true })
  supplierId: string | null;

  @Field(() => SearchRequestForQuotationStatusEnum, { nullable: true })
  status: SearchRequestForQuotationStatusEnum | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}

@InputType()
export class RequestForQuotationAnswerMaterialInput {
  @Field(() => ID)
  materialId: string;

  @Field(() => Float)
  unitPrice: number;
}
export const requestForQuotationAnswerMaterialSchema = z.object({
  materialId: z.string().trim().uuid(),
  unitPrice: z.number().positive(),
});

@InputType()
export class SaveRequestForQuotationAnswerInput {
  @Field(() => [RequestForQuotationAnswerMaterialInput])
  materials: RequestForQuotationAnswerMaterialInput[];
}
export const saveRequestForQuotationAnswerSchema = z.object({
  materials: z.array(requestForQuotationAnswerMaterialSchema).min(1),
});
