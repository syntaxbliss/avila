import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { z } from 'zod';

@InputType()
export class PartMaterialInput {
  @Field(() => ID)
  materialId: string;

  @Field(() => Float)
  quantity: number;
}
export const partMaterialSchema = z.object({
  materialId: z.string().trim().uuid(),
  quantity: z.number().positive(),
});

@InputType()
export class SavePartInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => [PartMaterialInput])
  materials: PartMaterialInput[];
}
export const savePartSchema = z.object({
  name: z.string().trim().min(1).max(250),
  code: z.string().trim().min(1).max(20),
  materials: z.array(partMaterialSchema).min(1),
});
