import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PurchaseOrderEntity from './purchase-order.entity';
import Material_SupplierEntity from './material_supplier.entity';

@Entity('purchase_order_material')
export default class PurchaseOrderMaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrderEntity, purchaseOrder => purchaseOrder.materials, {
    nullable: false,
  })
  purchaseOrder: PurchaseOrderEntity;

  @Column()
  purchaseOrderId: string;

  @ManyToOne(() => Material_SupplierEntity, { nullable: false })
  @JoinColumn({ name: 'material_supplierId' })
  material_supplier: Material_SupplierEntity;

  @Column()
  material_supplierId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
