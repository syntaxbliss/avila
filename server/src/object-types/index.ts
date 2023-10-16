import { registerEnumType } from '@nestjs/graphql';
import {
  MachineElementTypeEnum,
  MeasureUnitEnum,
  PaymentMethodEnum,
  RequestForQuotationStatusEnum,
} from 'src/entities';

registerEnumType(MachineElementTypeEnum, { name: 'MachineElementType' });
registerEnumType(MeasureUnitEnum, { name: 'MeasureUnit' });
registerEnumType(PaymentMethodEnum, { name: 'PaymentMethod' });
registerEnumType(RequestForQuotationStatusEnum, { name: 'RequestForQuotationStatus' });

export * from './commons';
export * from './machine-element.object-type';
export * from './machine.object-type';
export * from './material.object-type';
export * from './part-material.object-type';
export * from './part.object-type';
export * from './purchase-order-material.object-type';
export * from './purchase-order-payment.object-type';
export * from './purchase-order.object-type';
export * from './request-for-quotation-material.object-type';
export * from './request-for-quotation.object-type';
export * from './supplier.object-type';
