import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { MaterialEntity, PartEntity, PartMaterialEntity } from 'src/entities';
import { CreatePartInput, createPartSchema } from 'src/input-types';
import { PartMaterialLoader } from 'src/loaders';
import { mapPartEntityToPart } from 'src/mappers';
import { Part, PartMaterial } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => Part)
export default class PartResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly partMaterialLoader: PartMaterialLoader
  ) {}

  @Mutation(() => Part)
  async createPart(@Args('input') input: CreatePartInput): Promise<Part> {
    const parsedData = createPartSchema.parse(input);

    const partWithSameCode = await this.ds.manager.findOneBy(PartEntity, { code: parsedData.code });

    if (partWithSameCode) {
      throw new GraphQLError('CODE_TAKEN');
    }

    const materials = await this.ds.manager.find(MaterialEntity, {
      where: { id: In(parsedData.materials.map(m => m.materialId)) },
    });

    if (materials.length !== parsedData.materials.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      // part
      const part = em.create<PartEntity>(PartEntity, {
        name: parsedData.name,
        code: parsedData.code,
      });
      await em.save(part);

      // materials
      const partMaterials = parsedData.materials.map(pm => {
        const partMaterial = em.create<PartMaterialEntity>(PartMaterialEntity, {
          part,
          materialId: pm.materialId,
          quantity: pm.quantity,
        });

        return em.save(partMaterial);
      });
      await Promise.all(partMaterials);

      return mapPartEntityToPart(part);
    });
  }

  @ResolveField()
  async materials(@Parent() parent: Part): Promise<PartMaterial[]> {
    return this.partMaterialLoader.loadPartMaterialsByPart(parent.id);
  }
}
