import { MeasureUnit } from '../__generated__/graphql';
import FormSelect, { FormSelectOption } from './FormSelect';

type ValueType = MeasureUnit | '';

type FormSelectProps = React.ComponentProps<typeof FormSelect>;

type Props = Omit<FormSelectProps, 'value' | 'onChange' | 'options'> & {
  onChange: (value: ValueType) => void;
  value: ValueType;
};

const descriptionByUnit: Record<MeasureUnit, string> = {
  [MeasureUnit.Gr]: 'Gramos [gr]',
  [MeasureUnit.Kg]: 'Kilogramos [kg]',
  [MeasureUnit.Tn]: 'Toneladas [tn]',
  [MeasureUnit.Lt]: 'Litros [lt]',
  [MeasureUnit.Mt]: 'Metros [mt]',
  [MeasureUnit.Unit]: 'Unidades [un]',
};

const options: FormSelectOption[] = Object.values(MeasureUnit).map(unit => ({
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
