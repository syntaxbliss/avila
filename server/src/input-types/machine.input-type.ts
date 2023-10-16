import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { MachineElementTypeEnum } from 'src/entities';
import { z } from 'zod';

@InputType()
export class MachineElementInput {
  @Field(() => MachineElementTypeEnum)
  elementType: MachineElementTypeEnum;

  @Field(() => ID)
  elementId: string;

  @Field(() => Float)
  quantity: number;
}
export const machineElementSchema = z.object({
  elementType: z.nativeEnum(MachineElementTypeEnum),
  elementId: z.string().trim().uuid(),
  quantity: z.number().positive(),
});

@InputType()
export class SaveMachineInput {
  @Field(() => String)
  name: string;

  @Field(() => [MachineElementInput])
  elements: MachineElementInput[];
}
export const saveMachineSchema = z.object({
  name: z.string().trim().min(1).max(250),
  elements: z.array(machineElementSchema).min(1),
});
