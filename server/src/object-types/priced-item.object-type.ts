import { Field, Float, ID, ObjectType, createUnionType } from '@nestjs/graphql';
import { Material } from './material.object-type';
import { Part } from './part.object-type';

export const PricedItemElementUnion = createUnionType({
  name: 'PricedItemElementUnion',
  types: () => [Material, Part] as const,
});

@ObjectType()
export class PricedItem {
  @Field(() => ID)
  id: string;

  @Field(() => PricedItemElementUnion)
  element: typeof PricedItemElementUnion;

  @Field(() => Float, { nullable: true })
  unitPrice: number | null;
}
