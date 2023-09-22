import { PurchaseOrderPaymentMethod } from '../__generated__/graphql';
import FormSelect, { FormSelectOption } from './FormSelect';

type ValueType = PurchaseOrderPaymentMethod | '';

type FormSelectProps = React.ComponentProps<typeof FormSelect>;

type Props = Omit<FormSelectProps, 'value' | 'onChange' | 'options'> & {
  onChange: (value: ValueType) => void;
  value: ValueType;
};

const descriptionByUnit: Record<PurchaseOrderPaymentMethod, string> = {
  [PurchaseOrderPaymentMethod.BankTransfer]: 'Transferencia bancaria',
  [PurchaseOrderPaymentMethod.Cash]: 'Efectivo',
  [PurchaseOrderPaymentMethod.Check]: 'Cheque',
  [PurchaseOrderPaymentMethod.ECheck]: 'E-Check',
};

const options: FormSelectOption[] = Object.values(PurchaseOrderPaymentMethod).map(method => ({
  label: descriptionByUnit[method],
  value: method,
}));

export default function PaymentMethodSelect({ onChange, value, ...rest }: Props): JSX.Element {
  return (
    <FormSelect
      value={value}
      onChange={e => onChange(e.target.value as ValueType)}
      options={options}
      {...rest}
    />
  );
}
