import * as DataLoader from 'dataloader';
import { MaterialEntity } from 'src/entities';
import { mapSupplierEntityToSupplier } from 'src/mappers';
import { Supplier } from 'src/object-types';
import { DataSource, In } from 'typeorm';

export default class SupplierLoader {
  suppliersByMaterial: DataLoader<string, Supplier[]>;

  constructor(private readonly ds: DataSource) {
    this.suppliersByMaterial = new DataLoader(async (ids: readonly string[]) => {
      const materials = await this.ds.manager.find(MaterialEntity, {
        where: { id: In(ids) },
        order: { name: 'ASC', material_suppliers: { supplier: { name: 'ASC' } } },
        relations: { material_suppliers: { supplier: true } },
      });

      return materials.map(m => {
        return m.material_suppliers.reduce((acc, m_s) => {
          if (m_s.deletedAt === null) {
            acc.push(mapSupplierEntityToSupplier(m_s.supplier));
          }

          return acc;
        }, [] as Supplier[]);
      });
    });
  }
}
