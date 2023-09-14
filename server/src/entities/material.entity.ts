import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MaterialMeasureUnitEnum } from './enums';
import Material_SupplierEntity from './material_supplier.entity';

@Entity('material')
export default class MaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: MaterialMeasureUnitEnum })
  measureUnit: MaterialMeasureUnitEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentQuantity: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  alertQuantity: number | null;

  @OneToMany(() => Material_SupplierEntity, material_supplier => material_supplier.material)
  material_suppliers: Material_SupplierEntity[];

  @DeleteDateColumn()
  deletedAt: Date | null;
}
