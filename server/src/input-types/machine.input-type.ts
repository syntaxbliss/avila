import { Field, Float, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { MachineElementElementTypeEnum } from 'src/entities';
import { z } from 'zod';
import { QuerySortOrderEnum } from './commons';

@InputType()
export class MachineElementInput {
  @Field(() => MachineElementElementTypeEnum)
  elementType: MachineElementElementTypeEnum;

  @Field(() => ID)
  elementId: string;

  @Field(() => Float)
  quantity: number;
}
export const machineElementSchema = z.object({
  elementType: z.nativeEnum(MachineElementElementTypeEnum),
  elementId: z.string().trim().uuid(),
  quantity: z.number().positive(),
});

@InputType()
export class SaveMachineInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => [MachineElementInput])
  elements: MachineElementInput[];
}
export const saveMachineSchema = z.object({
  name: z.string().trim().min(1).max(250),
  code: z.string().trim().min(1).max(20),
  elements: z.array(machineElementSchema).min(1),
});

enum SearchMachineQuerySortFieldEnum {
  CODE = 'code',
  NAME = 'name',
}
registerEnumType(SearchMachineQuerySortFieldEnum, { name: 'SearchMachineQuerySortField' });

@InputType()
export class SearchMachineInput {
  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => SearchMachineQuerySortFieldEnum, { nullable: true })
  sortField: SearchMachineQuerySortFieldEnum | null;

  @Field(() => QuerySortOrderEnum, { nullable: true })
  sortOrder: QuerySortOrderEnum | null;
}
