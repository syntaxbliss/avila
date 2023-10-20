import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configuration')
export default class ConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  parameter: string;

  @Column()
  value: string;
}
