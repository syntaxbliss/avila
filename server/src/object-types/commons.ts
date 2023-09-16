import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PaginationInfo {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  pageNumber: number;

  @Field(() => Int)
  pageSize: number;
}

export function PaginatedResponse<TObjectType extends object>(TObjectTypeClass: Type<TObjectType>) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    @Field(() => [TObjectTypeClass])
    items: TObjectType[];

    @Field(() => PaginationInfo)
    paginationInfo: PaginationInfo;
  }

  return PaginatedResponseClass;
}
