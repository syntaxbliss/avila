import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import MaterialSupplierEntity from './material_supplier.entity';

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

  @OneToMany(() => MaterialSupplierEntity, materialSupplier => materialSupplier.supplier)
  materialSuppliers: MaterialSupplierEntity[];
}
