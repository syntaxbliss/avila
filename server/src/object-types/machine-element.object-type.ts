import { Field, Float, ID, ObjectType, createUnionType } from '@nestjs/graphql';
import { Material } from './material.object-type';
import { Part } from './part.object-type';

export const MachineElementUnion = createUnionType({
  name: 'MachineElementUnion',
  types: () => [Material, Part] as const,
});

@ObjectType()
export class MachineElement {
  @Field(() => ID)
  id: string;

  @Field(() => MachineElementUnion)
  element: typeof MachineElementUnion;

  @Field(() => Float)
  quantity: number;
}
