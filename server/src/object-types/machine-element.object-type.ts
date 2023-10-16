import { Field, Float, ID, ObjectType, createUnionType } from '@nestjs/graphql';
import { Material } from './material.object-type';
import { Part } from './part.object-type';

const MachieElementType = createUnionType({
  name: 'MachieElementType',
  types: () => [Material, Part] as const,
});

@ObjectType()
export class MachineElement {
  @Field(() => ID)
  id: string;

  @Field(() => MachieElementType)
  elementType: typeof MachieElementType;

  @Field(() => Float)
  quantity: number;
}
