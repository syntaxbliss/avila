import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { MeasureUnitEnum } from 'src/entities';
import { PaginatedResponse } from './commons';
import { Supplier } from './supplier.object-type';

@ObjectType()
export class Material {
  @Field(() => ID)
  id: string;

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

  @Field(() => [Supplier])
  suppliers: Supplier[];
}

@ObjectType()
export class PaginatedMaterials extends PaginatedResponse(Material) {}
