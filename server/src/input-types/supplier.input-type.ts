import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

@InputType()
export class SaveSupplierInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  address: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phone: number | null;

  @Field(() => String, { nullable: true })
  contact: string | null;
}
export const saveSupplierSchema = z.object({
  name: z.string().trim().min(1).max(250),
  address: z.string().trim().max(250).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().max(250).optional(),
  contact: z.string().trim().max(250).optional(),
});

@InputType()
export class SearchSupplierInput {
  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}
