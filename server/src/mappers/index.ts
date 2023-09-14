import { MaterialEntity, SupplierEntity } from 'src/entities';
import { Material, Supplier } from 'src/object-types';

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
