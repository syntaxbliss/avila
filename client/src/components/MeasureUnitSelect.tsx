import { MaterialMeasureUnit } from '../__generated__/graphql';
import FormSelect, { FormSelectOption } from './FormSelect';

type ValueType = MaterialMeasureUnit | '';

type FormSelectProps = React.ComponentProps<typeof FormSelect>;

type Props = Omit<FormSelectProps, 'value' | 'onChange' | 'options'> & {
  onChange: (value: ValueType) => void;
  value: ValueType;
};

const descriptionByUnit: Record<MaterialMeasureUnit, string> = {
  [MaterialMeasureUnit.Gr]: 'Gramos [gr]',
  [MaterialMeasureUnit.Kg]: 'Kilogramos [kg]',
  [MaterialMeasureUnit.Tn]: 'Toneladas [tn]',
  [MaterialMeasureUnit.Lt]: 'Litros [lt]',
  [MaterialMeasureUnit.Mt]: 'Metros [mt]',
  [MaterialMeasureUnit.Unit]: 'Unidades [un]',
};

const options: FormSelectOption[] = Object.values(MaterialMeasureUnit).map(unit => ({
  label: descriptionByUnit[unit],
  value: unit,
}));

export default function MeasureUnitSelect({ onChange, value, ...rest }: Props): JSX.Element {
  return (
    <FormSelect
      value={value}
      onChange={e => onChange(e.target.value as ValueType)}
      options={options}
      {...rest}
    />
  );
}
