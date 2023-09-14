import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

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
}
export const saveSupplierSchema = z.object({
  name: z.string().trim().min(1).max(250),
  address: z.string().trim().max(250).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().max(250).optional(),
});
