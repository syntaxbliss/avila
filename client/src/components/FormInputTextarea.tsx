import { FormControl, FormErrorMessage, FormLabel, GridItem, Textarea } from '@chakra-ui/react';

type Props = {
  autoFocus?: React.ComponentProps<typeof Textarea>['autoFocus'];
  error?: string;
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isDisabled?: React.ComponentProps<typeof Textarea>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Textarea>['isRequired'];
  label?: string;
  onChange: React.ComponentProps<typeof Textarea>['onChange'];
  value: React.ComponentProps<typeof Textarea>['value'];
};

export default function FormInputTextarea({
  autoFocus,
  error,
  gridColumn,
  isDisabled,
  isRequired,
  label,
  onChange,
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn}>
      <FormControl isRequired={isRequired} isInvalid={Boolean(error)}>
        {label && <FormLabel>{label}</FormLabel>}

        <Textarea
          autoFocus={autoFocus}
          isDisabled={isDisabled}
          variant="filled"
          value={value}
          onChange={onChange}
          resize="none"
          rows={5}
        />

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </GridItem>
  );
}
