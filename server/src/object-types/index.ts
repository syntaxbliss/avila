import { registerEnumType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';

registerEnumType(MaterialMeasureUnitEnum, { name: 'MaterialMeasureUnit' });

export * from './commons';
export * from './material.object-type';
export * from './purchase-order-material.object-type';
export * from './purchase-order.object-type';
export * from './supplier.object-type';
