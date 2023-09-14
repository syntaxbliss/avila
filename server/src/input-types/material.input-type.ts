import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';
import { z } from 'zod';

@InputType()
export class SaveMaterialInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => MaterialMeasureUnitEnum)
  measureUnit: MaterialMeasureUnitEnum;

  @Field(() => Float, { nullable: true })
  currentQuantity: number | null;

  @Field(() => Float, { nullable: true })
  alertQuantity: number | null;

  @Field(() => [ID])
  suppliers: string[];
}
export const saveMaterialSchema = z.object({
  name: z.string().trim().min(1).max(250),
  code: z.string().trim().min(1).max(20),
  measureUnit: z.nativeEnum(MaterialMeasureUnitEnum),
  currentQuantity: z.number().nonnegative().optional(),
  alertQuantity: z.number().nonnegative().optional(),
  suppliers: z.array(z.string().uuid()),
});
