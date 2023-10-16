import { Field, Float, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

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

enum SearchPartQuerySortFieldEnum {
  CODE = 'code',
  NAME = 'name',
}
registerEnumType(SearchPartQuerySortFieldEnum, { name: 'SearchPartQuerySortField' });

@InputType()
export class SearchPartInput {
  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => SearchPartQuerySortFieldEnum, { nullable: true })
  sortField: SearchPartQuerySortFieldEnum | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}
