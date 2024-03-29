import { Field, Float, ID, ObjectType, createUnionType } from '@nestjs/graphql';
import { Material } from './material.object-type';
import { Part } from './part.object-type';

export const MachineElementElementUnion = createUnionType({
  name: 'MachineElementElementUnion',
  types: () => [Material, Part] as const,
});

@ObjectType()
export class MachineElement {
  @Field(() => ID)
  id: string;

  @Field(() => MachineElementElementUnion)
  element: typeof MachineElementElementUnion;

  @Field(() => Float)
  quantity: number;
}
