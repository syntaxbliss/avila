import { registerEnumType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';

registerEnumType(MaterialMeasureUnitEnum, { name: 'MaterialMeasureUnit' });

export * from './commons';
export { default as Material } from './material.object-type';
export { default as Supplier } from './supplier.object-type';
