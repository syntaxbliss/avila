import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MaterialEntity from './material.entity';
import SupplierEntity from './supplier.entity';

@Entity('material_supplier')
export default class MaterialSupplierEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MaterialEntity, material => material.materialSuppliers, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  material: MaterialEntity;

  @Column('uuid')
  materialId: string;

  @ManyToOne(() => SupplierEntity, supplier => supplier.materialSuppliers, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  supplier: SupplierEntity;

  @Column('uuid')
  supplierId: string;
}
