import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { SupplierEntity } from 'src/entities';
import { mapMaterialEntityToMaterial } from 'src/mappers';
import { Material } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class MaterialLoader {
  private materialsBySupplier: {
    loader: DataLoader<string, Material[]>;
    findOptions: FindManyOptions<SupplierEntity>;
  };

  constructor(private readonly ds: DataSource) {
    const findOptions: typeof this.materialsBySupplier.findOptions = {
      relations: { material_suppliers: { material: true } },
      order: { name: 'ASC', material_suppliers: { material: { name: 'ASC' } } },
    };

    const loader: typeof this.materialsBySupplier.loader = new DataLoader(
      async (ids: readonly string[]) => {
        const suppliers = await this.ds.manager.find(SupplierEntity, {
          where: { id: In(ids) },
          ...this.materialsBySupplier.findOptions,
        });

        return suppliers.map(s => {
          return s.material_suppliers.reduce((acc, m_s) => {
            if (m_s.deletedAt === null) {
              acc.push(mapMaterialEntityToMaterial(m_s.material));
            }

            return acc;
          }, [] as Material[]);
        });
      },
      { cache: false }
    );

    this.materialsBySupplier = { findOptions, loader };
  }

  setMaterialsBySupplierOrder(order: FindManyOptions<SupplierEntity>['order']) {
    this.materialsBySupplier.findOptions.order = order;
  }

  loadMaterialsBySupplier(id: string) {
    return this.materialsBySupplier.loader.load(id);
  }
}
