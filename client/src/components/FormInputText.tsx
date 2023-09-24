import { FormControl, FormErrorMessage, FormLabel, GridItem, Input } from '@chakra-ui/react';

type Props = {
  autoFocus?: React.ComponentProps<typeof Input>['autoFocus'];
  error?: string;
  flex?: React.ComponentProps<typeof GridItem>['flex'];
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isDisabled?: React.ComponentProps<typeof Input>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Input>['isRequired'];
  label?: string;
  onChange: React.ComponentProps<typeof Input>['onChange'];
  type?: React.HTMLInputTypeAttribute;
  value: React.ComponentProps<typeof Input>['value'];
};

export default function FormInputText({
  autoFocus,
  error,
  flex,
  gridColumn,
  isDisabled,
  isRequired,
  label,
  onChange,
  type = 'text',
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn} flex={flex}>
      <FormControl isRequired={isRequired} isInvalid={Boolean(error)}>
        {label && <FormLabel>{label}</FormLabel>}

        <Input
          autoFocus={autoFocus}
          isDisabled={isDisabled}
          variant="filled"
          type={type}
          value={value}
          onChange={onChange}
        />

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </GridItem>
  );
}
