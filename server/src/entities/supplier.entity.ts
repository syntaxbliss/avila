import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @DeleteDateColumn()
  deletedAt: Date | null;
}
