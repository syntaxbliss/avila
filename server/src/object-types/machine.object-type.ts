import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MachineElement } from './machine-element.object-type';

@ObjectType()
export class Machine {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [MachineElement])
  elements: MachineElement[];
}
