import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Material_SupplierEntity from './material_supplier.entity';

@Entity('supplier')
export default class SupplierEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @OneToMany(() => Material_SupplierEntity, material_supplier => material_supplier.supplier)
  material_suppliers: Material_SupplierEntity[];

  @DeleteDateColumn()
  deletedAt: Date | null;
}
