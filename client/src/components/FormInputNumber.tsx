import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';

type Props = {
  error?: string;
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isDisabled?: React.ComponentProps<typeof NumberInput>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Input>['isRequired'];
  label?: string;
  max?: React.ComponentProps<typeof NumberInput>['max'];
  min?: React.ComponentProps<typeof NumberInput>['min'];
  onChange?: React.ComponentProps<typeof NumberInput>['onChange'];
  precision?: React.ComponentProps<typeof NumberInput>['precision'];
  step?: React.ComponentProps<typeof NumberInput>['step'];
  value?: React.ComponentProps<typeof NumberInput>['value'];
};

export default function FormInputNumber({
  error,
  gridColumn,
  isDisabled,
  isRequired,
  label,
  max = 99999999.99,
  min = 0,
  onChange,
  precision = 2,
  step = 0.01,
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn} w="full">
      <FormControl isInvalid={Boolean(error)}>
        {label && (
          <FormLabel>
            {label}
            {isRequired && (
              <Text display="inline-block" ml={1} color="red.500">
                *
              </Text>
            )}
          </FormLabel>
        )}

        <NumberInput
          isDisabled={isDisabled}
          max={max}
          min={min}
          onChange={onChange}
          precision={precision}
          step={step}
          value={value}
          variant="filled"
        >
          <NumberInputField />

          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </GridItem>
  );
}
