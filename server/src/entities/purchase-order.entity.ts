import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import PurchaseOrderMaterialEntity from './purchase-order-material.entity';
import PurchaseOrderPaymentEntity from './purchase-order-payment.entity';

@Entity('purchase_order')
export default class PurchaseOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: number;

  @Column()
  emitter: string;

  @Column({ type: 'varchar', nullable: true })
  deliveryLocation: string | null;

  @Column({ type: 'varchar', nullable: true })
  conditions: string | null;

  @Column()
  orderedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  deliveryNote: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @OneToMany(
    () => PurchaseOrderMaterialEntity,
    purchaseOrderMaterial => purchaseOrderMaterial.purchaseOrder,
    { nullable: false }
  )
  materials: PurchaseOrderMaterialEntity[];

  @OneToMany(
    () => PurchaseOrderPaymentEntity,
    purchaseOrderPayment => purchaseOrderPayment.purchaseOrder,
    { nullable: true }
  )
  payments: PurchaseOrderPaymentEntity[] | null;
}
