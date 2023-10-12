import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PurchaseOrderEntity from './purchase-order.entity';
import { PaymentMethodEnum } from './enums';

@Entity('purchase_order_payment')
export default class PurchaseOrderPaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrderEntity, purchaseOrder => purchaseOrder.payments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  purchaseOrder: PurchaseOrderEntity;

  @Column('uuid')
  purchaseOrderId: string;

  @Column({ type: 'enum', enum: PaymentMethodEnum })
  method: PaymentMethodEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  paidAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
