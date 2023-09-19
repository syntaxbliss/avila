import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Material } from './material.object-type';

@ObjectType()
export class PurchaseOrderMaterial {
  materialId: string;

  @Field(() => Material)
  material: Material;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;
}
