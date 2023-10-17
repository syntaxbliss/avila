import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MaterialEntity, PartEntity, PricedItemEntity } from 'src/entities';
import { mapMaterialEntityToMaterial, mapPartEntityToPart } from 'src/mappers';
import { PricedItemElementUnion } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class PricedItemLoader {
  private elementByPricedItem: {
    loader: DataLoader<string, typeof PricedItemElementUnion>;
    findOptions: FindManyOptions<PricedItemEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createElementByPricedItemLoader();
  }

  private createElementByPricedItemLoader() {
    const findOptions: typeof this.elementByPricedItem.findOptions = {
      relations: { material: true, part: true },
      order: { material: { name: 'ASC' }, part: { name: 'ASC' } },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const pricedItems = await this.ds.manager.find(PricedItemEntity, {
          where: { id: In(ids) },
          ...this.elementByPricedItem.findOptions,
        });

        return ids.map(id => {
          const pricedItem = pricedItems.find(pi => pi.id === id);

          if (!pricedItem) {
            throw new Error();
          }

          if (pricedItem.materialId) {
            return mapMaterialEntityToMaterial(pricedItem.material as MaterialEntity);
          }

          return mapPartEntityToPart(pricedItem.part as PartEntity);
        });
      },
      { cache: false }
    );

    this.elementByPricedItem = { findOptions, loader };
  }

  setElementByPricedItemOrder(order: FindManyOptions<PricedItemEntity>['order']) {
    this.elementByPricedItem.findOptions.order = order;
  }

  loadElementByPricedItem(id: string): Promise<typeof PricedItemElementUnion> {
    return this.elementByPricedItem.loader.load(id);
  }
}
