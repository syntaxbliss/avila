import {
  MaterialEntity,
  PartEntity,
  PartMaterialEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  PurchaseOrderPaymentEntity,
  RequestForQuotationEntity,
  RequestForQuotationMaterialEntity,
  SupplierEntity,
} from 'src/entities';
import {
  Material,
  Part,
  PartMaterial,
  PurchaseOrder,
  PurchaseOrderMaterial,
  PurchaseOrderPayment,
  RequestForQuotation,
  RequestForQuotationMaterial,
  Supplier,
} from 'src/object-types';

export const mapMaterialEntityToMaterial = (entity: MaterialEntity): Material => {
  const material = new Material();
  material.id = entity.id;
  material.name = entity.name;
  material.code = entity.code;
  material.measureUnit = entity.measureUnit;
  material.currentQuantity = entity.currentQuantity;
  material.alertQuantity = entity.alertQuantity;

  return material;
};

export const mapSupplierEntityToSupplier = (entity: SupplierEntity): Supplier => {
  const supplier = new Supplier();
  supplier.id = entity.id;
  supplier.name = entity.name;
  supplier.address = entity.address;
  supplier.email = entity.email;
  supplier.phone = entity.phone;

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
  purchaseOrderMaterial.materialId = entity.materialSupplier.materialId;

  return purchaseOrderMaterial;
};

export const mapPurchaseOrderPaymentEntityToPurchaseOrderPayment = (
  entity: PurchaseOrderPaymentEntity
): PurchaseOrderPayment => {
  const purchaseOrderPayment = new PurchaseOrderPayment();
  purchaseOrderPayment.id = entity.id;
  purchaseOrderPayment.method = entity.method;
  purchaseOrderPayment.amount = entity.amount;
  purchaseOrderPayment.paidAt = entity.paidAt;
  purchaseOrderPayment.notes = entity.notes;

  return purchaseOrderPayment;
};

export const mapRequestForQuotationEntityToRequestForQuotation = (
  entity: RequestForQuotationEntity
): RequestForQuotation => {
  const requestForQuotation = new RequestForQuotation();
  requestForQuotation.id = entity.id;
  requestForQuotation.orderedAt = entity.orderedAt;
  requestForQuotation.paymentMethod = entity.paymentMethod;
  requestForQuotation.status = entity.status;
  requestForQuotation.hasAssociatedPurchaseOrder = Boolean(entity.purchaseOrderId);

  return requestForQuotation;
};

export const mapRequestForQuotationMaterialEntityToRequestForQuotationMaterial = (
  entity: RequestForQuotationMaterialEntity
): RequestForQuotationMaterial => {
  const requestForQuotationMaterial = new RequestForQuotationMaterial();
  requestForQuotationMaterial.quantity = entity.quantity;
  requestForQuotationMaterial.unitPrice = entity.unitPrice;
  requestForQuotationMaterial.materialId = entity.materialSupplier.materialId;

  return requestForQuotationMaterial;
};

export const mapPartEntityToPart = (entity: PartEntity): Part => {
  const part = new Part();
  part.id = entity.id;
  part.name = entity.name;
  part.code = entity.code;

  return part;
};

export const mapPartMaterialEntityToPartMaterial = (entity: PartMaterialEntity): PartMaterial => {
  const partMaterial = new PartMaterial();
  partMaterial.id = entity.id;
  partMaterial.quantity = entity.quantity;

  return partMaterial;
};
