import { Flex, FormLabel, GridItem, Input, Text } from '@chakra-ui/react';
import FormInputText from './FormInputText';

type Props = {
  autoFocus?: React.ComponentProps<typeof Input>['autoFocus'];
  error?: string;
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isDisabled?: React.ComponentProps<typeof Input>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Input>['isRequired'];
  label?: string;
  maxW?: React.ComponentProps<typeof GridItem>['maxW'];
  onChange: ([from, to]: [string, string]) => void;
  value: [string, string];
};

export default function FormDateRange({
  autoFocus,
  error,
  gridColumn,
  isDisabled,
  isRequired,
  label,
  maxW,
  onChange,
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn} w="full" maxW={maxW}>
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

      <Flex w="full">
        <FormInputText
          flex={1}
          autoFocus={autoFocus}
          type="date"
          value={value[0]}
          onChange={e => onChange([e.target.value, value[1]])}
          error={error ? ' ' : undefined}
          isDisabled={isDisabled}
        />

        <FormLabel flex={0} mb="0" mt="2.5" mx="2" p="0">
          hasta
        </FormLabel>

        <FormInputText
          flex={1}
          type="date"
          value={value[1]}
          onChange={e => onChange([value[0], e.target.value])}
          error={error ? ' ' : undefined}
          isDisabled={isDisabled}
        />
      </Flex>

      {error && (
        <Text color="red.500" fontSize="sm" lineHeight="normal">
          {error}
        </Text>
      )}
    </GridItem>
  );
}
