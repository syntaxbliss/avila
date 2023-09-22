import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MaterialEntity, SupplierEntity } from 'src/entities';
import { mapMaterialEntityToMaterial } from 'src/mappers';
import { Material } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class MaterialLoader {
  private materialsBySupplier: {
    loader: DataLoader<string, Material[]>;
    findOptions: FindManyOptions<SupplierEntity>;
  };

  private materialByPurchaseOrderMaterial: {
    loader: DataLoader<string, Material>;
  };

  constructor(private readonly ds: DataSource) {
    this.createMaterialsBySupplierLoader();
    this.createMaterialByPurchaseOrderMaterialLoader();
  }

  private createMaterialsBySupplierLoader() {
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

  private createMaterialByPurchaseOrderMaterialLoader() {
    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const materials = await this.ds.manager.find(MaterialEntity, { where: { id: In(ids) } });

        return ids.map(id => {
          const material = materials.find(m => m.id === id) as MaterialEntity;

          return mapMaterialEntityToMaterial(material);
        });
      },
      { cache: false }
    );

    this.materialByPurchaseOrderMaterial = { loader };
  }

  setMaterialsBySupplierOrder(order: FindManyOptions<SupplierEntity>['order']) {
    this.materialsBySupplier.findOptions.order = order;
  }

  loadMaterialsBySupplier(id: string) {
    return this.materialsBySupplier.loader.load(id);
  }

  loadMaterialByPurchaseOrderMaterial(id: string) {
    return this.materialByPurchaseOrderMaterial.loader.load(id);
  }
}
