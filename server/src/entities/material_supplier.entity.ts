import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MaterialEntity from './material.entity';
import SupplierEntity from './supplier.entity';

@Entity('material__supplier')
export default class Material_SupplierEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MaterialEntity, material => material.material_suppliers, { nullable: false })
  material: MaterialEntity;

  @Column()
  materialId: string;

  @ManyToOne(() => SupplierEntity, supplier => supplier.material_suppliers, { nullable: false })
  supplier: SupplierEntity;

  @Column()
  supplierId: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
