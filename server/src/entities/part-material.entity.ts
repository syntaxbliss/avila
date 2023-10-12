import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PartEntity from './part.entity';
import MaterialEntity from './material.entity';

@Entity('part_material')
export default class PartMaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PartEntity, part => part.materials, { nullable: false, onDelete: 'CASCADE' })
  part: PartEntity;

  @Column('uuid')
  partId: string;

  @ManyToOne(() => MaterialEntity, { nullable: false, onDelete: 'RESTRICT' })
  material: MaterialEntity;

  @Column('uuid')
  materialId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;
}
