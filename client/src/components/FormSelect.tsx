import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  GridItem,
  Select,
  forwardRef,
} from '@chakra-ui/react';

export type FormSelectOption = {
  label: string;
  value: string;
};

type Props = {
  error?: string;
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  helperText?: string;
  isDisabled?: React.ComponentProps<typeof Select>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Select>['isRequired'];
  label?: string;
  mt?: React.ComponentProps<typeof GridItem>['mt'];
  onChange: React.ComponentProps<typeof Select>['onChange'];
  options: FormSelectOption[];
  placeholder?: React.ComponentProps<typeof Select>['placeholder'];
  value: React.ComponentProps<typeof Select>['value'];
};

const FormSelect = forwardRef<Props, 'select'>(
  (
    {
      error,
      gridColumn,
      helperText,
      isDisabled,
      isRequired,
      label,
      mt,
      onChange,
      options,
      placeholder = ' ',
      value,
    },
    ref
  ) => {
    return (
      <GridItem gridColumn={gridColumn} mt={mt}>
        <FormControl isRequired={isRequired} isInvalid={Boolean(error)}>
          {label && <FormLabel>{label}</FormLabel>}

          <Select
            ref={ref}
            variant="filled"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <FormErrorMessage>{error}</FormErrorMessage>

          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </GridItem>
    );
  }
);

export default FormSelect;
