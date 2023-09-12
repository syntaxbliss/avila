import { FormControl, FormErrorMessage, FormLabel, GridItem, Select } from '@chakra-ui/react';

export type FormSelectOption = {
  label: string;
  value: string;
};

type Props = {
  error?: string;
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isDisabled?: React.ComponentProps<typeof Select>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Select>['isRequired'];
  label?: string;
  onChange: React.ComponentProps<typeof Select>['onChange'];
  options: FormSelectOption[];
  value: React.ComponentProps<typeof Select>['value'];
};

export default function FormSelect({
  error,
  gridColumn,
  isDisabled,
  isRequired,
  label,
  onChange,
  options,
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn}>
      <FormControl isRequired={isRequired} isInvalid={Boolean(error)}>
        {label && <FormLabel>{label}</FormLabel>}

        <Select
          variant="filled"
          value={value}
          onChange={onChange}
          placeholder=" "
          isDisabled={isDisabled}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </GridItem>
  );
}
