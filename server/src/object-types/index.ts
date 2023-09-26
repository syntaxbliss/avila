import { registerEnumType } from '@nestjs/graphql';
import {
  MaterialMeasureUnitEnum,
  PurchaseOrderPaymentMethodEnum,
  PurchaseOrderStatusEnum,
} from 'src/entities';

registerEnumType(MaterialMeasureUnitEnum, { name: 'MaterialMeasureUnit' });
registerEnumType(PurchaseOrderPaymentMethodEnum, { name: 'PurchaseOrderPaymentMethod' });
registerEnumType(PurchaseOrderStatusEnum, { name: 'PurchaseOrderStatus' });

export * from './commons';
export * from './material.object-type';
export * from './purchase-order-material.object-type';
export * from './purchase-order-payment.object-type';
export * from './purchase-order.object-type';
export * from './supplier.object-type';
