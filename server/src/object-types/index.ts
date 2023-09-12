import { registerEnumType } from '@nestjs/graphql';
import { MaterialMeasureUnitEnum } from 'src/entities';

registerEnumType(MaterialMeasureUnitEnum, { name: 'MaterialMeasureUnit' });

export { default as Material } from './material.object-type';
