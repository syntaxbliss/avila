import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MachineEntity from './machine.entity';
import { MachineElementElementTypeEnum } from './enums';
import MaterialEntity from './material.entity';
import PartEntity from './part.entity';

@Entity('machine_element')
export default class MachineElementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MachineEntity, machine => machine.elements, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  machine: MachineEntity;
  @Column('uuid')
  machineId: string;

  @Column({ type: 'enum', enum: MachineElementElementTypeEnum })
  elementType: MachineElementElementTypeEnum;

  @ManyToOne(() => MaterialEntity, { nullable: true, onDelete: 'RESTRICT' })
  material: MaterialEntity | null;
  @Column('uuid', { nullable: true })
  materialId: string | null;

  @ManyToOne(() => PartEntity, { nullable: true, onDelete: 'RESTRICT' })
  part: PartEntity | null;
  @Column('uuid', { nullable: true })
  partId: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;
}
