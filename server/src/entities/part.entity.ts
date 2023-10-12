import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import PartMaterialEntity from './part-material.entity';

@Entity('part')
export default class PartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => PartMaterialEntity, partMaterial => partMaterial.part, { nullable: false })
  materials: PartMaterialEntity[];
}
