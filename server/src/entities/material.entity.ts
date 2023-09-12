import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MaterialMeasureUnitEnum } from './enums';

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

  @DeleteDateColumn()
  deletedAt: Date | null;
}
