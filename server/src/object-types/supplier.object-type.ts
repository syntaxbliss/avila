import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from './commons';
import { Material } from './material.object-type';

@ObjectType()
export class Supplier {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  address: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;

  @Field(() => [Material])
  materials: Material[];
}

@ObjectType()
export class PaginatedSuppliers extends PaginatedResponse(Supplier) {}
