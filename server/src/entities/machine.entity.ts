import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import MachineElementEntity from './machine-element.entity';

@Entity('machine')
export default class MachineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => MachineElementEntity, element => element.machine, { nullable: false })
  elements: MachineElementEntity[];
}
