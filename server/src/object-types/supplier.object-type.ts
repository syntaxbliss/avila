import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from './commons';

@ObjectType()
export class Supplier {
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

@ObjectType()
export class PaginatedSuppliers extends PaginatedResponse(Supplier) {}
