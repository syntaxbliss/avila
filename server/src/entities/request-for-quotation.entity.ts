import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethodEnum, RequestForQuotationStatusEnum } from './enums';
import RequestForQuotationMaterialEntity from './request-form-quotation-material.entity';
import PurchaseOrderEntity from './purchase-order.entity';

@Entity('request_for_quotation')
export default class RequestForQuotationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderedAt: Date;

  @OneToMany(
    () => RequestForQuotationMaterialEntity,
    requestForQuotationMaterial => requestForQuotationMaterial.requestForQuotation,
    {
      nullable: false,
    }
  )
  materials: RequestForQuotationMaterialEntity[];

  @Column({ type: 'enum', enum: PaymentMethodEnum })
  paymentMethod: PaymentMethodEnum;

  @Column({
    type: 'enum',
    enum: RequestForQuotationStatusEnum,
    default: RequestForQuotationStatusEnum.UNANSWERED,
  })
  status: RequestForQuotationStatusEnum;

  @OneToOne(() => PurchaseOrderEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn()
  purchaseOrder: PurchaseOrderEntity | null;

  @Column('uuid', { nullable: true })
  purchaseOrderId: string | null;
}
