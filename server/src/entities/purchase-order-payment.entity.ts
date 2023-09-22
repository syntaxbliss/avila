import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PurchaseOrderEntity from './purchase-order.entity';
import { PurchaseOrderPaymentMethodEnum } from './enums';

@Entity('purchase_order_payment')
export default class PurchaseOrderPaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrderEntity, purchaseOrder => purchaseOrder.payments, {
    nullable: false,
  })
  purchaseOrder: PurchaseOrderEntity;

  @Column()
  purchaseOrderId: string;

  @Column({ type: 'enum', enum: PurchaseOrderPaymentMethodEnum })
  method: PurchaseOrderPaymentMethodEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  paidAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
