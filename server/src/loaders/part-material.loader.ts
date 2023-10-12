import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PartEntity } from 'src/entities';
import { mapPartMaterialEntityToPartMaterial } from 'src/mappers';
import { PartMaterial } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class PartMaterialLoader {
  private partMaterialsByPart: {
    loader: DataLoader<string, PartMaterial[]>;
    findOptions: FindManyOptions<PartEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createPartMaterialsByPartLoader();
  }

  private createPartMaterialsByPartLoader() {
    const findOptions: typeof this.partMaterialsByPart.findOptions = {
      relations: { materials: true },
      order: { name: 'ASC', materials: { material: { name: 'ASC' } } },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const parts = await this.ds.manager.find(PartEntity, {
          where: { id: In(ids) },
          ...this.partMaterialsByPart.findOptions,
        });

        return ids.map(id => {
          const part = parts.find(p => p.id === id);

          if (!part) {
            throw new Error();
          }

          return part.materials.map(pm => mapPartMaterialEntityToPartMaterial(pm));
        });
      },
      { cache: false }
    );

    this.partMaterialsByPart = { findOptions, loader };
  }

  setPartMaterialsByPartOrder(order: FindManyOptions<PartEntity>['order']) {
    this.partMaterialsByPart.findOptions.order = order;
  }

  loadPartMaterialsByPart(id: string): Promise<PartMaterial[]> {
    return this.partMaterialsByPart.loader.load(id);
  }
}
