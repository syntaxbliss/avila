import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PartMaterial } from './part-material.object-type';

@ObjectType()
export class Part {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => [PartMaterial])
  materials: PartMaterial[];
}
