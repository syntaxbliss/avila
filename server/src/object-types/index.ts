import { registerEnumType } from '@nestjs/graphql';
import {
  MeasureUnitEnum,
  PaymentMethodEnum,
  PurchaseOrderStatusEnum,
  RequestForQuotationStatusEnum,
} from 'src/entities';

registerEnumType(MeasureUnitEnum, { name: 'MeasureUnit' });
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
