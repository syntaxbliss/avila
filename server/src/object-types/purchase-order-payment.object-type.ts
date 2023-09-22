import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { PurchaseOrderPaymentMethodEnum } from 'src/entities';

@ObjectType()
export class PurchaseOrderPayment {
  @Field(() => ID)
  id: string;

  @Field(() => PurchaseOrderPaymentMethodEnum)
  method: PurchaseOrderPaymentMethodEnum;

  @Field(() => Float)
  amount: number;

  @Field(() => Date)
  paidAt: Date;

  @Field(() => String, { nullable: true })
  notes: string | null;
}
