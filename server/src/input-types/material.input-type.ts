import { Field, Float, InputType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';
import { z } from 'zod';

@InputType()
export class CreateMaterialInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => MaterialMeasureUnitEnum)
  measureUnit: MaterialMeasureUnitEnum;

  @Field(() => Float)
  currentQuantity: number;

  @Field(() => Float, { nullable: true })
  alertQuantity: number | null;
}
export const createMaterialSchema = z.object({
  name: z.string().trim().min(1).max(250),
  code: z.string().trim().min(1).max(20),
  measureUnit: z.nativeEnum(MaterialMeasureUnitEnum),
  currentQuantity: z.number().nonnegative(),
  alertQuantity: z.number().nonnegative().optional(),
});
