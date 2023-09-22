import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PurchaseOrderEntity } from 'src/entities';
import { mapPurchaseOrderMaterialEntityToPurchaseOrderMaterial } from 'src/mappers';
import { PurchaseOrderMaterial } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Injectable()
export default class PurchaseOrderMaterialLoader {
  private purchaseOrderMaterialsByPurchaseOrder: {
    loader: DataLoader<string, PurchaseOrderMaterial[]>;
  };

  constructor(private readonly ds: DataSource) {
    this.createPurchaseOrderMaterialsByPurchaseOrderLoader();
  }

  private createPurchaseOrderMaterialsByPurchaseOrderLoader() {
    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const purchaseOrders = await this.ds.manager.find(PurchaseOrderEntity, {
          where: { id: In(ids) },
          relations: { materials: { material_supplier: true } },
        });

        return purchaseOrders.map(po =>
          po.materials.map(pom => mapPurchaseOrderMaterialEntityToPurchaseOrderMaterial(pom))
        );
      },
      { cache: false }
    );

    this.purchaseOrderMaterialsByPurchaseOrder = { loader };
  }

  loadPurchaseOrderMaterialsByPurchaseOrder(id: string) {
    return this.purchaseOrderMaterialsByPurchaseOrder.loader.load(id);
  }
}
