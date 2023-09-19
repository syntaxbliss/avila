import {
  MaterialEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  SupplierEntity,
} from 'src/entities';
import { Material, PurchaseOrder, PurchaseOrderMaterial, Supplier } from 'src/object-types';

export const mapMaterialEntityToMaterial = (entity: MaterialEntity): Material => {
  const material = new Material();
  material.id = entity.id;
  material.name = entity.name;
  material.code = entity.code;
  material.measureUnit = entity.measureUnit;
  material.currentQuantity = entity.currentQuantity;
  material.alertQuantity = entity.alertQuantity;
  material.deletedAt = entity.deletedAt;

  return material;
};

export const mapSupplierEntityToSupplier = (entity: SupplierEntity): Supplier => {
  const supplier = new Supplier();
  supplier.id = entity.id;
  supplier.name = entity.name;
  supplier.address = entity.address;
  supplier.email = entity.email;
  supplier.phone = entity.phone;
  supplier.deletedAt = entity.deletedAt;

  return supplier;
};

export const mapPurchaseOrderEntityToPurchaseOrder = (
  entity: PurchaseOrderEntity
): PurchaseOrder => {
  const purchaseOrder = new PurchaseOrder();
  purchaseOrder.id = entity.id;
  purchaseOrder.orderedAt = entity.orderedAt;
  purchaseOrder.deliveredAt = entity.deliveredAt;
  purchaseOrder.deliveryNote = entity.deliveryNote;
  purchaseOrder.totalAmount = entity.totalAmount;
  purchaseOrder.paidAmount = entity.paidAmount;

  return purchaseOrder;
};

export const mapPurchaseOrderMaterialEntityToPurchaseOrderMaterial = (
  entity: PurchaseOrderMaterialEntity
): PurchaseOrderMaterial => {
  const purchaseOrderMaterial = new PurchaseOrderMaterial();
  purchaseOrderMaterial.quantity = entity.quantity;
  purchaseOrderMaterial.unitPrice = entity.unitPrice;
  purchaseOrderMaterial.materialId = entity.material_supplier.materialId;

  return purchaseOrderMaterial;
};
