import _ from 'lodash';
import { MaterialMeasureUnit } from '../__generated__/graphql';

const descriptionByUnit: Record<MaterialMeasureUnit, string> = {
  [MaterialMeasureUnit.Gr]: 'gr',
  [MaterialMeasureUnit.Kg]: 'kg',
  [MaterialMeasureUnit.Tn]: 'tn',
  [MaterialMeasureUnit.Lt]: 'lt',
  [MaterialMeasureUnit.Mt]: 'mt',
  [MaterialMeasureUnit.Unit]: 'un',
};

const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

export const formatMaterialQuantity = (
  quantity: number | null | undefined,
  measureUnit: MaterialMeasureUnit
) => {
  if (_.isNull(quantity) || _.isUndefined(quantity)) {
    return null;
  }

  return `${currencyFormatter.format(quantity).substring(2)} ${descriptionByUnit[measureUnit]}`;
};
