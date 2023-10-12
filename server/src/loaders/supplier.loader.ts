import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MaterialEntity, PurchaseOrderEntity, RequestForQuotationEntity } from 'src/entities';
import { mapSupplierEntityToSupplier } from 'src/mappers';
import { Supplier } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class SupplierLoader {
  private suppliersByMaterial: {
    loader: DataLoader<string, Supplier[]>;
    findOptions: FindManyOptions<MaterialEntity>;
  };

  private supplierByPurchaseOrder: {
    loader: DataLoader<string, Supplier>;
    findOptions: FindManyOptions<PurchaseOrderEntity>;
  };

  private supplierByRequestForQuotation: {
    loader: DataLoader<string, Supplier>;
    findOptions: FindManyOptions<RequestForQuotationEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createSuppliersByMaterialLoader();
    this.createSupplierByPurchaseOrderLoader();
    this.createSupplierByRequestForQuotationLoader();
  }

  private createSuppliersByMaterialLoader() {
    const findOptions: typeof this.suppliersByMaterial.findOptions = {
      relations: { materialSuppliers: { supplier: true } },
      order: { name: 'ASC', materialSuppliers: { supplier: { name: 'ASC' } } },
    };

    const loader: typeof this.suppliersByMaterial.loader = new DataLoader(
      async (ids: readonly string[]) => {
        const materials = await this.ds.manager.find(MaterialEntity, {
          where: { id: In(ids) },
          ...this.suppliersByMaterial.findOptions,
        });

        return ids.map(id => {
          const material = materials.find(m => m.id === id);

          if (!material) {
            throw new Error();
          }

          return material.materialSuppliers.map(ms => mapSupplierEntityToSupplier(ms.supplier));
        });
      },
      { cache: false }
    );

    this.suppliersByMaterial = { findOptions, loader };
  }

  private createSupplierByPurchaseOrderLoader() {
    const findOptions: typeof this.supplierByPurchaseOrder.findOptions = {
      relations: { materials: { materialSupplier: { supplier: true } } },
      order: { orderedAt: 'DESC' },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const purchaseOrders = await this.ds.manager.find(PurchaseOrderEntity, {
          where: { id: In(ids) },
          ...this.supplierByPurchaseOrder.findOptions,
        });

        return purchaseOrders.map(po =>
          mapSupplierEntityToSupplier(po.materials[0].materialSupplier.supplier)
        );
      },
      { cache: false }
    );

    this.supplierByPurchaseOrder = { findOptions, loader };
  }

  private createSupplierByRequestForQuotationLoader() {
    const findOptions: typeof this.supplierByRequestForQuotation.findOptions = {
      relations: { materials: { materialSupplier: { supplier: true } } },
      order: { orderedAt: 'DESC' },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const requestsForQuotation = await this.ds.manager.find(RequestForQuotationEntity, {
          where: { id: In(ids) },
          ...this.supplierByRequestForQuotation.findOptions,
        });

        return ids.map(id => {
          const requestForQuotation = requestsForQuotation.find(rfq => rfq.id === id);

          if (!requestForQuotation) {
            throw new Error();
          }

          return mapSupplierEntityToSupplier(
            requestForQuotation.materials[0].materialSupplier.supplier
          );
        }, [] as Supplier[]);
      },
      { cache: false }
    );

    this.supplierByRequestForQuotation = { findOptions, loader };
  }

  setSuppliersByMaterialOrder(order: FindManyOptions<MaterialEntity>['order']) {
    this.suppliersByMaterial.findOptions.order = order;
  }

  setSupplierByPurchaseOrderOrder(order: FindManyOptions<PurchaseOrderEntity>['order']) {
    this.supplierByPurchaseOrder.findOptions.order = order;
  }

  setSupplierByRequestForQuotationOrder(
    order: FindManyOptions<RequestForQuotationEntity>['order']
  ) {
    this.supplierByRequestForQuotation.findOptions.order = order;
  }

  loadSuppliersByMaterial(id: string) {
    return this.suppliersByMaterial.loader.load(id);
  }

  loadSupplierByPurchaseOrder(id: string) {
    return this.supplierByPurchaseOrder.loader.load(id);
  }

  loadSupplierByRequestForQuotation(id: string) {
    return this.supplierByRequestForQuotation.loader.load(id);
  }
}
