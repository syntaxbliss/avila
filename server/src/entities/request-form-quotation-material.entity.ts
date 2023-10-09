import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Material_SupplierEntity from './material_supplier.entity';
import RequestForQuotationEntity from './request-for-quotation.entity';

@Entity('request_for_quotation_material')
export default class RequestForQuotationMaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => RequestForQuotationEntity,
    requestForQuotation => requestForQuotation.materials,
    {
      nullable: false,
    }
  )
  requestForQuotation: RequestForQuotationEntity;

  @Column()
  requestForQuotationId: string;

  @ManyToOne(() => Material_SupplierEntity, { nullable: false })
  @JoinColumn({ name: 'material_supplierId' })
  material_supplier: Material_SupplierEntity;

  @Column()
  material_supplierId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number | null;
}
