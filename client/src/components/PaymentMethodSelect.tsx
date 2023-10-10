import { forwardRef } from '@chakra-ui/react';
import FormSelect, { FormSelectOption } from './FormSelect';
import { PaymentMethod } from '../__generated__/graphql';
import { paymentMethodText } from '../helpers';

type ValueType = PaymentMethod | '';

type FormSelectProps = React.ComponentProps<typeof FormSelect>;

type Props = Omit<FormSelectProps, 'value' | 'onChange' | 'options'> & {
  onChange: (value: ValueType) => void;
  value: ValueType;
};

const options: FormSelectOption[] = Object.values(PaymentMethod).map(method => ({
  label: paymentMethodText[method],
  value: method,
}));

const PaymentMethodSelect = forwardRef<Props, 'select'>(({ onChange, value, ...rest }, ref) => {
  return (
    <FormSelect
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value as ValueType)}
      options={options}
      {...rest}
    />
  );
});

export default PaymentMethodSelect;
