import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Material } from './material.object-type';

@ObjectType()
export class RequestForQuotationMaterial {
  materialId: string;

  @Field(() => Material)
  material: Material;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float, { nullable: true })
  unitPrice: number | null;
}
