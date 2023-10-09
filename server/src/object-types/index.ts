import { registerEnumType } from '@nestjs/graphql';
import {
  MaterialMeasureUnitEnum,
  PaymentMethodEnum,
  PurchaseOrderStatusEnum,
  RequestForQuotationStatusEnum,
} from 'src/entities';

registerEnumType(MaterialMeasureUnitEnum, { name: 'MaterialMeasureUnit' });
registerEnumType(PaymentMethodEnum, { name: 'PaymentMethod' });
registerEnumType(PurchaseOrderStatusEnum, { name: 'PurchaseOrderStatus' });
registerEnumType(RequestForQuotationStatusEnum, { name: 'RequestForQuotationStatus' });

export * from './commons';
export * from './material.object-type';
export * from './purchase-order-material.object-type';
export * from './purchase-order-payment.object-type';
export * from './purchase-order.object-type';
export * from './request-for-quotation-material.object-type';
export * from './request-for-quotation.object-type';
export * from './supplier.object-type';
