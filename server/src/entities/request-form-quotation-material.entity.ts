import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MaterialSupplierEntity from './material_supplier.entity';
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
      onDelete: 'RESTRICT',
    }
  )
  requestForQuotation: RequestForQuotationEntity;

  @Column('uuid')
  requestForQuotationId: string;

  @ManyToOne(() => MaterialSupplierEntity, { nullable: false, onDelete: 'RESTRICT' })
  materialSupplier: MaterialSupplierEntity;

  @Column('uuid')
  materialSupplierId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number | null;
}
