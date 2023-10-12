import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PurchaseOrderEntity from './purchase-order.entity';
import MaterialSupplierEntity from './material_supplier.entity';

@Entity('purchase_order_material')
export default class PurchaseOrderMaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrderEntity, purchaseOrder => purchaseOrder.materials, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  purchaseOrder: PurchaseOrderEntity;

  @Column('uuid')
  purchaseOrderId: string;

  @ManyToOne(() => MaterialSupplierEntity, { nullable: false, onDelete: 'RESTRICT' })
  materialSupplier: MaterialSupplierEntity;

  @Column('uuid')
  materialSupplierId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
