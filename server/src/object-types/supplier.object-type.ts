import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class Supplier {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  address: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;
}
