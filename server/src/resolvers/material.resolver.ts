import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { MaterialEntity } from 'src/entities';
import { CreateMaterialInput, createMaterialSchema } from 'src/input-types';
import { Material } from 'src/object-types';
import { DataSource } from 'typeorm';

@Resolver(() => Material)
export default class MaterialResolver {
  constructor(private readonly ds: DataSource) {}

  private mapMaterialEntityToMaterial(entity: MaterialEntity): Material {
    const material = new Material();
    material.id = entity.id;
    material.name = entity.name;
    material.code = entity.code;
    material.measureUnit = entity.measureUnit;
    material.currentQuantity = entity.currentQuantity;
    material.alertQuantity = entity.alertQuantity;
    material.deletedAt = entity.deletedAt;

    return material;
  }

  @Query(() => [Material])
  async materials(): Promise<Material[]> {
    const materials = await this.ds.manager.find(MaterialEntity, { order: { name: 'ASC' } });

    return materials.map(material => this.mapMaterialEntityToMaterial(material));
  }

  @Mutation(() => Material)
  async createMaterial(@Args('input') input: CreateMaterialInput): Promise<Material> {
    const data = createMaterialSchema.parse(input);

    const materialWithSameCode = await this.ds.manager.findOneBy(MaterialEntity, {
      code: data.code,
    });

    if (materialWithSameCode) {
      throw new GraphQLError('CODE_TAKEN');
    }

    const material = this.ds.manager.create<MaterialEntity>(MaterialEntity, {
      name: data.name,
      code: data.code,
      measureUnit: data.measureUnit,
      currentQuantity: data.currentQuantity,
      alertQuantity: data.alertQuantity ?? null,
    });
    await this.ds.manager.save(material);

    return this.mapMaterialEntityToMaterial(material);
  }
}
