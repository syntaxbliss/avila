import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { MaterialEntity } from 'src/entities';
import { SaveMaterialInput, saveMaterialSchema } from 'src/input-types';
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

  @Query(() => Material)
  async material(@Args('materialId', { type: () => ID }) materialId: string): Promise<Material> {
    const material = await this.ds.manager.findOneByOrFail(MaterialEntity, { id: materialId });

    return this.mapMaterialEntityToMaterial(material);
  }

  @Mutation(() => Material)
  async createMaterial(@Args('input') input: SaveMaterialInput): Promise<Material> {
    const data = saveMaterialSchema.parse(input);

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
      alertQuantity: data.alertQuantity,
    });
    await this.ds.manager.save(material);

    return this.mapMaterialEntityToMaterial(material);
  }

  @Mutation(() => Material)
  async updateMaterial(
    @Args('materialId', { type: () => ID }) materialId: string,
    @Args('input') input: SaveMaterialInput
  ): Promise<Material> {
    const data = saveMaterialSchema.parse(input);
    const material = await this.ds.manager.findOneByOrFail(MaterialEntity, { id: materialId });

    const materialWithSameCode = await this.ds.manager.findOneBy(MaterialEntity, {
      code: data.code,
    });

    if (materialWithSameCode && materialWithSameCode.id !== material.id) {
      throw new GraphQLError('CODE_TAKEN');
    }

    material.name = data.name;
    material.code = data.code;
    material.measureUnit = data.measureUnit;
    material.currentQuantity = data.currentQuantity ?? null;
    material.alertQuantity = data.alertQuantity ?? null;
    await this.ds.manager.save(material);

    return this.mapMaterialEntityToMaterial(material);
  }
}
