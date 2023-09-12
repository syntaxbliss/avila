import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';

@ObjectType()
export default class Material {
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

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;
}
