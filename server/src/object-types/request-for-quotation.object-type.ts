import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Supplier } from './supplier.object-type';
import { PaymentMethodEnum, RequestForQuotationStatusEnum } from 'src/entities';
import { RequestForQuotationMaterial } from './request-for-quotation-material.object-type';
import { PaginatedResponse } from './commons';

@ObjectType()
export class RequestForQuotation {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  orderedAt: Date;

  @Field(() => Supplier)
  supplier: Supplier;

  @Field(() => RequestForQuotationStatusEnum)
  status: RequestForQuotationStatusEnum;

  @Field(() => [RequestForQuotationMaterial])
  materials: RequestForQuotationMaterial[];

  @Field(() => PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @Field(() => Boolean)
  hasAssociatedPurchaseOrder: boolean;
}

@ObjectType()
export class PaginatedRequestsForQuotation extends PaginatedResponse(RequestForQuotation) {}
