import { Field, Float, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { MeasureUnitEnum } from 'src/entities';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

@InputType()
export class SaveMaterialInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => MeasureUnitEnum)
  measureUnit: MeasureUnitEnum;

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
  measureUnit: z.nativeEnum(MeasureUnitEnum),
  currentQuantity: z.number().nonnegative().optional(),
  alertQuantity: z.number().nonnegative().optional(),
  suppliers: z.array(z.string().uuid()),
});

enum SearchMaterialQuerySortFieldEnum {
  CODE = 'code',
  NAME = 'name',
}
registerEnumType(SearchMaterialQuerySortFieldEnum, { name: 'SearchMaterialQuerySortField' });

@InputType()
export class SearchMaterialInput {
  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => Boolean, { nullable: true })
  lowQuantity: boolean | null;

  @Field(() => SearchMaterialQuerySortFieldEnum, { nullable: true })
  sortField: SearchMaterialQuerySortFieldEnum | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}

@InputType()
export class UpdateMaterialQuantityInput {
  @Field(() => ID)
  materialId: string;

  @Field(() => Float)
  quantity: number;
}
export const updateMaterialQuantitySchema = z.object({
  materialId: z.string().trim().uuid(),
  quantity: z.number().nonnegative(),
});
