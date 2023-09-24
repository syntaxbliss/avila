import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MaterialEntity, PurchaseOrderEntity } from 'src/entities';
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

  constructor(private readonly ds: DataSource) {
    this.createSuppliersByMaterialLoader();
    this.createSupplierByPurchaseOrderLoader();
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

  setSuppliersByMaterialOrder(order: FindManyOptions<MaterialEntity>['order']) {
    this.suppliersByMaterial.findOptions.order = order;
  }

  setSupplierByPurchaseOrderOrder(order: FindManyOptions<PurchaseOrderEntity>['order']) {
    this.supplierByPurchaseOrder.findOptions.order = order;
  }

  loadSuppliersByMaterial(id: string) {
    return this.suppliersByMaterial.loader.load(id);
  }

  loadSupplierByPurchaseOrder(id: string) {
    return this.supplierByPurchaseOrder.loader.load(id);
  }
}
