import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MachineElement } from './machine-element.object-type';
import { PaginatedResponse } from './commons';

@ObjectType()
export class Machine {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => [MachineElement])
  elements: MachineElement[];
}

@ObjectType()
export class PaginatedMachines extends PaginatedResponse(Machine) {}
