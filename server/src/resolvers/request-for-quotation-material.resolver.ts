import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MaterialLoader } from 'src/loaders';
import { Material, RequestForQuotationMaterial } from 'src/object-types';

@Resolver(() => RequestForQuotationMaterial)
export default class RequestForQuotationMaterialResolver {
  constructor(private readonly materialLoader: MaterialLoader) {}

  @ResolveField()
  async material(@Parent() parent: RequestForQuotationMaterial): Promise<Material> {
    return this.materialLoader.loadMaterialByRequestForQuotationMaterial(parent.materialId);
  }
}
