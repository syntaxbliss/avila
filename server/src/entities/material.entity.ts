import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MeasureUnitEnum } from './enums';
import MaterialSupplierEntity from './material_supplier.entity';

@Entity('material')
export default class MaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: MeasureUnitEnum })
  measureUnit: MeasureUnitEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentQuantity: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  alertQuantity: number | null;

  @OneToMany(() => MaterialSupplierEntity, materialSupplier => materialSupplier.material)
  materialSuppliers: MaterialSupplierEntity[];
}
