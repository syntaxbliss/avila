import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

export enum QuerySortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
registerEnumType(QuerySortOrderEnum, { name: 'QuerySortOrder' });

@InputType()
export class PaginationInput {
  @Field(() => Int)
  pageNumber: number;

  @Field(() => Int)
  pageSize: number;
}
