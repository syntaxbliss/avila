import { Args, Float, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PricedItemEntity } from 'src/entities';
import { PricedItemLoader } from 'src/loaders';
import { mapPricedItemEntityToPricedItem } from 'src/mappers';
import { PricedItem, PricedItemElementUnion } from 'src/object-types';
import { DataSource } from 'typeorm';
import { z } from 'zod';

@Resolver(() => PricedItem)
export default class PricedItemResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly pricedItemLoader: PricedItemLoader
  ) {}

  @Query(() => [PricedItem])
  async pricedItems(): Promise<PricedItem[]> {
    const pricedItems = await this.ds.manager.find(PricedItemEntity, {
      order: { material: { name: 'ASC' }, part: { name: 'ASC' } },
    });

    this.pricedItemLoader.setElementByPricedItemOrder({
      material: { name: 'ASC' },
      part: { name: 'ASC' },
    });

    return pricedItems.map(pi => mapPricedItemEntityToPricedItem(pi));
  }

  @Mutation(() => PricedItem)
  async updatePricedItem(
    @Args('pricedItemId', { type: () => ID }) pricedItemId: string,
    @Args('unitPrice', { type: () => Float }) unitPrice: number
  ): Promise<PricedItem> {
    const parsedData = z
      .object({ pricedItemId: z.string().trim().uuid(), unitPrice: z.number().positive() })
      .parse({ pricedItemId, unitPrice });
    const pricedItem = await this.ds.manager.findOneByOrFail(PricedItemEntity, {
      id: parsedData.pricedItemId,
    });

    pricedItem.unitPrice = parsedData.unitPrice;
    await this.ds.manager.save(pricedItem);

    return mapPricedItemEntityToPricedItem(pricedItem);
  }

  @ResolveField()
  async element(@Parent() parent: PricedItem): Promise<typeof PricedItemElementUnion> {
    return this.pricedItemLoader.loadElementByPricedItem(parent.id);
  }
}
