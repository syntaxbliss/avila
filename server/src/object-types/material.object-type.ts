import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';
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

  @Field(() => MaterialMeasureUnitEnum)
  measureUnit: MaterialMeasureUnitEnum;

  @Field(() => Float, { nullable: true })
  currentQuantity: number | null;

  @Field(() => Float, { nullable: true })
  alertQuantity: number | null;

  @Field(() => [Supplier])
  suppliers: Supplier[];

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;
}

@ObjectType()
export class PaginatedMaterials extends PaginatedResponse(Material) {}
