import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PurchaseOrderEntity } from 'src/entities';
import { mapPurchaseOrderPaymentEntityToPurchaseOrderPayment } from 'src/mappers';
import { PurchaseOrderPayment } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Injectable()
export default class PurchaseOrderPaymentLoader {
  private purchaseOrderPaymentsByPurchaseOrder: {
    loader: DataLoader<string, PurchaseOrderPayment[] | null>;
  };

  constructor(private readonly ds: DataSource) {
    this.createPurchaseOrderPaymentsByPurchaseOrderLoader();
  }

  private createPurchaseOrderPaymentsByPurchaseOrderLoader() {
    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const purchaseOrders = await this.ds.manager.find(PurchaseOrderEntity, {
          where: { id: In(ids) },
          order: { payments: { paidAt: 'DESC' } },
          relations: { payments: true },
        });

        return ids.map(id => {
          const purchaseOrder = purchaseOrders.find(po => po.id === id);

          if (!purchaseOrder) {
            throw new Error();
          }

          if (purchaseOrder.payments?.length) {
            return purchaseOrder.payments.map(p =>
              mapPurchaseOrderPaymentEntityToPurchaseOrderPayment(p)
            );
          }

          return null;
        });
      },
      { cache: false }
    );

    this.purchaseOrderPaymentsByPurchaseOrder = { loader };
  }

  loadPurchaseOrderPaymentsByPurchaseOrder(id: string) {
    return this.purchaseOrderPaymentsByPurchaseOrder.loader.load(id);
  }
}
