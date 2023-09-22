import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MaterialLoader } from 'src/loaders';
import { Material, PurchaseOrderMaterial } from 'src/object-types';

@Resolver(() => PurchaseOrderMaterial)
export default class PurchaseOrderMaterialResolver {
  constructor(private readonly materialLoader: MaterialLoader) {}

  @ResolveField()
  async material(@Parent() parent: PurchaseOrderMaterial): Promise<Material> {
    return this.materialLoader.loadMaterialByPurchaseOrderMaterial(parent.materialId);
  }
}
