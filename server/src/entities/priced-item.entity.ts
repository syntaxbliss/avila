import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import MaterialEntity from './material.entity';
import PartEntity from './part.entity';
import { PricedItemElementTypeEnum } from './enums';

@Entity('priced_item')
export default class PricedItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PricedItemElementTypeEnum })
  elementType: PricedItemElementTypeEnum;

  @OneToOne(() => MaterialEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  material: MaterialEntity | null;
  @Column('uuid', { nullable: true })
  materialId: string | null;

  @OneToOne(() => PartEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  part: PartEntity | null;
  @Column('uuid', { nullable: true })
  partId: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number | null;
}
