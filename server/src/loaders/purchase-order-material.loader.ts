import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PurchaseOrderEntity } from 'src/entities';
import { mapPurchaseOrderMaterialEntityToPurchaseOrderMaterial } from 'src/mappers';
import { PurchaseOrderMaterial } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class PurchaseOrderMaterialLoader {
  private purchaseOrderMaterialsByPurchaseOrder: {
    loader: DataLoader<string, PurchaseOrderMaterial[]>;
    findOptions: FindManyOptions<PurchaseOrderEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createPurchaseOrderMaterialsByPurchaseOrderLoader();
  }

  private createPurchaseOrderMaterialsByPurchaseOrderLoader() {
    const findOptions: typeof this.purchaseOrderMaterialsByPurchaseOrder.findOptions = {
      relations: { materials: { material_supplier: true } },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const purchaseOrders = await this.ds.manager.find(PurchaseOrderEntity, {
          where: { id: In(ids) },
          ...this.purchaseOrderMaterialsByPurchaseOrder.findOptions,
        });

        return ids.map(id => {
          const purchaseOrder = purchaseOrders.find(po => po.id === id);

          if (!purchaseOrder) {
            throw new Error();
          }

          return purchaseOrder.materials.map(pom =>
            mapPurchaseOrderMaterialEntityToPurchaseOrderMaterial(pom)
          );
        });
      },
      { cache: false }
    );

    this.purchaseOrderMaterialsByPurchaseOrder = { findOptions, loader };
  }

  setPurchaseOrderMaterialsByPurchaseOrderOrder(includeDeleted = false) {
    this.purchaseOrderMaterialsByPurchaseOrder.findOptions.withDeleted = includeDeleted;
  }

  loadPurchaseOrderMaterialsByPurchaseOrder(id: string) {
    return this.purchaseOrderMaterialsByPurchaseOrder.loader.load(id);
  }
}
