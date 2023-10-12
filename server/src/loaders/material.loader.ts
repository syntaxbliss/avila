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
    findOptions: FindManyOptions<MaterialEntity>;
  };

  private materialByRequestForQuotationMaterial: {
    loader: DataLoader<string, Material>;
    findOptions: FindManyOptions<MaterialEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createMaterialsBySupplierLoader();
    this.createMaterialByPurchaseOrderMaterialLoader();
    this.createMaterialByRequestForQuotationMaterialLoader();
  }

  private createMaterialsBySupplierLoader() {
    const findOptions: typeof this.materialsBySupplier.findOptions = {
      relations: { materialSuppliers: { material: true } },
      order: { name: 'ASC', materialSuppliers: { material: { name: 'ASC' } } },
    };

    const loader: typeof this.materialsBySupplier.loader = new DataLoader(
      async (ids: readonly string[]) => {
        const suppliers = await this.ds.manager.find(SupplierEntity, {
          where: { id: In(ids) },
          ...this.materialsBySupplier.findOptions,
        });

        return ids.map(id => {
          const supplier = suppliers.find(s => s.id === id);

          if (!supplier) {
            throw new Error();
          }

          return supplier.materialSuppliers.map(ms => mapMaterialEntityToMaterial(ms.material));
        });
      },
      { cache: false }
    );

    this.materialsBySupplier = { findOptions, loader };
  }

  private createMaterialByPurchaseOrderMaterialLoader() {
    const findOptions: typeof this.materialByPurchaseOrderMaterial.findOptions = {};

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const materials = await this.ds.manager.find(MaterialEntity, {
          where: { id: In(ids) },
          ...this.materialByPurchaseOrderMaterial.findOptions,
        });

        return ids.map(id => {
          const material = materials.find(m => m.id === id) as MaterialEntity;

          return mapMaterialEntityToMaterial(material);
        });
      },
      { cache: false }
    );

    this.materialByPurchaseOrderMaterial = { findOptions, loader };
  }

  private createMaterialByRequestForQuotationMaterialLoader() {
    const findOptions: typeof this.materialByRequestForQuotationMaterial.findOptions = {};

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const materials = await this.ds.manager.find(MaterialEntity, {
          where: { id: In(ids) },
          ...this.materialByRequestForQuotationMaterial.findOptions,
        });

        return ids.map(id => {
          const material = materials.find(m => m.id === id) as MaterialEntity;

          return mapMaterialEntityToMaterial(material);
        });
      },
      { cache: false }
    );

    this.materialByRequestForQuotationMaterial = { findOptions, loader };
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

  loadMaterialByRequestForQuotationMaterial(id: string) {
    return this.materialByRequestForQuotationMaterial.loader.load(id);
  }
}
