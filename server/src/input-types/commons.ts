import { registerEnumType } from '@nestjs/graphql';

export enum QuerySortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
registerEnumType(QuerySortOrderEnum, { name: 'QuerySortOrder' });
