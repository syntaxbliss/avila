import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { PaymentMethodEnum } from 'src/entities';

@ObjectType()
export class PurchaseOrderPayment {
  @Field(() => ID)
  id: string;

  @Field(() => PaymentMethodEnum)
  method: PaymentMethodEnum;

  @Field(() => Float)
  amount: number;

  @Field(() => Date)
  paidAt: Date;

  @Field(() => String, { nullable: true })
  notes: string | null;
}
