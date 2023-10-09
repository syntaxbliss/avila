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
      relations: { material_suppliers: { supplier: true } },
      order: { name: 'ASC', material_suppliers: { supplier: { name: 'ASC' } } },
    };

    const loader: typeof this.suppliersByMaterial.loader = new DataLoader(
      async (ids: readonly string[]) => {
        const materials = await this.ds.manager.find(MaterialEntity, {
          where: { id: In(ids) },
          ...this.suppliersByMaterial.findOptions,
        });

        return materials.map(m => {
          return m.material_suppliers.reduce((acc, m_s) => {
            if (m_s.deletedAt === null) {
              acc.push(mapSupplierEntityToSupplier(m_s.supplier));
            }

            return acc;
          }, [] as Supplier[]);
        });
      },
      { cache: false }
    );

    this.suppliersByMaterial = { findOptions, loader };
  }

  private createSupplierByPurchaseOrderLoader() {
    const findOptions: typeof this.supplierByPurchaseOrder.findOptions = {
      relations: { materials: { material_supplier: { supplier: true } } },
      order: { orderedAt: 'DESC' },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const purchaseOrders = await this.ds.manager.find(PurchaseOrderEntity, {
          where: { id: In(ids) },
          ...this.supplierByPurchaseOrder.findOptions,
        });

        return purchaseOrders.map(po =>
          mapSupplierEntityToSupplier(po.materials[0].material_supplier.supplier)
        );
      },
      { cache: false }
    );

    this.supplierByPurchaseOrder = { findOptions, loader };
  }

  private createSupplierByRequestForQuotationLoader() {
    const findOptions: typeof this.supplierByRequestForQuotation.findOptions = {
      relations: { materials: { material_supplier: { supplier: true } } },
      order: { orderedAt: 'DESC' },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const requestsForQuotation = await this.ds.manager.find(RequestForQuotationEntity, {
          where: { id: In(ids) },
          ...this.supplierByRequestForQuotation.findOptions,
        });

        return requestsForQuotation.map(rfq =>
          mapSupplierEntityToSupplier(rfq.materials[0].material_supplier.supplier)
        );
      },
      { cache: false }
    );

    this.supplierByRequestForQuotation = { findOptions, loader };
  }

  setSuppliersByMaterialOrder(order: FindManyOptions<MaterialEntity>['order']) {
    this.suppliersByMaterial.findOptions.order = order;
  }

  setSupplierByPurchaseOrderOrder(
    order: FindManyOptions<PurchaseOrderEntity>['order'],
    includeDeleted = false
  ) {
    this.supplierByPurchaseOrder.findOptions.order = order;
    this.supplierByPurchaseOrder.findOptions.withDeleted = includeDeleted;
  }

  setSupplierByRequestForQuotation(
    order: FindManyOptions<RequestForQuotationEntity>['order'],
    includeDeleted = false
  ) {
    this.supplierByRequestForQuotation.findOptions.order = order;
    this.supplierByRequestForQuotation.findOptions.withDeleted = includeDeleted;
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
