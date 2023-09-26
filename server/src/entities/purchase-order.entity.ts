import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import PurchaseOrderMaterialEntity from './purchase-order-material.entity';
import PurchaseOrderPaymentEntity from './purchase-order-payment.entity';
import { PurchaseOrderStatusEnum } from './enums';

@Entity('purchase_order')
export default class PurchaseOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'enum', enum: PurchaseOrderStatusEnum, default: PurchaseOrderStatusEnum.ACTIVE })
  status: PurchaseOrderStatusEnum;
}
