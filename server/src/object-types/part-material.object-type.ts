import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Material } from './material.object-type';

@ObjectType()
export class PartMaterial {
  @Field(() => ID)
  id: string;

  @Field(() => Material)
  material: Material;

  @Field(() => Float)
  quantity: number;
}
