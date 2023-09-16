import { Field, Float, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

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

  @Field(() => SearchMaterialQuerySortFieldEnum, { nullable: true })
  sortField: SearchMaterialQuerySortFieldEnum | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}
