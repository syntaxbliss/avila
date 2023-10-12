import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MaterialLoader } from 'src/loaders';
import { Material, PartMaterial } from 'src/object-types';

@Resolver(() => PartMaterial)
export default class PartMaterialResolver {
  constructor(private readonly materialLoader: MaterialLoader) {}

  @ResolveField()
  async material(@Parent() parent: PartMaterial): Promise<Material> {
    return this.materialLoader.loadMaterialByPartMaterial(parent.id);
  }
}
