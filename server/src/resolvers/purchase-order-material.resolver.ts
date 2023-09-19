import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MaterialEntity } from 'src/entities';
import { mapMaterialEntityToMaterial } from 'src/mappers';
import { Material, PurchaseOrderMaterial } from 'src/object-types';
import { DataSource } from 'typeorm';

@Resolver(() => PurchaseOrderMaterial)
export default class PurchaseOrderMaterialResolver {
  constructor(private readonly ds: DataSource) {}

  @ResolveField()
  async material(@Parent() parent: PurchaseOrderMaterial): Promise<Material> {
    // FIXME: move to a data loader
    console.log('material field resolver @ parent', parent);

    const material = await this.ds.manager.findOneByOrFail(MaterialEntity, {
      id: parent.materialId,
    });

    return mapMaterialEntityToMaterial(material);
  }
}
