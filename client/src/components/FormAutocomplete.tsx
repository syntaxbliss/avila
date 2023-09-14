import { memo, useCallback, useMemo } from 'react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { Flex, FormLabel, GridItem, HStack, IconButton, Text } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

export type FormAutocompleteOption = {
  label: string;
  value: string;
};

type Props = {
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isRequired?: boolean;
  label?: string;
  maxSelections?: number;
  multiple?: boolean;
  onChange: (values: string[]) => void;
  options: FormAutocompleteOption[];
  placeholder?: string;
  value: string[];
};

export default function FormAutocomplete({
  gridColumn,
  isRequired,
  label,
  maxSelections,
  multiple,
  onChange,
  options,
  placeholder,
  value,
}: Props): JSX.Element {
  const availableOptions = useMemo(
    () => options.filter(i => !value.includes(i.value)),
    [value, options]
  );

  const optionTextByOptionValue: Record<string, string> = useMemo(() => {
    return options.reduce((obj, option) => {
      const { label, value } = option;

      obj[value] = label;

      return obj;
    }, {} as Record<string, string>);
  }, [options]);

  const pendingSelections = useMemo(() => {
    if (maxSelections) {
      return maxSelections - value.length;
    }

    return null;
  }, [maxSelections, value]);

  const handleChange = useCallback(
    (values: string[]) => {
      onChange(values);
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValues = [...value];

      newValues.splice(index, 1);

      onChange(newValues);
    },
    [value, onChange]
  );

  return (
    <GridItem display="flex" flexDir="column" w="full" gridColumn={gridColumn}>
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

      <HStack spacing="3" mb={value.length ? '3' : undefined} wrap="wrap">
        {value.map((v, index) => (
          <ValueTag
            key={v}
            primaryText={optionTextByOptionValue[v]}
            onClick={() => handleRemove(index)}
          />
        ))}
      </HStack>

      <AutoComplete
        emptyState={false}
        maxSelections={maxSelections}
        multiple={multiple}
        onChange={handleChange}
        openOnFocus
        restoreOnBlurIfEmpty={false}
        values={value}
        filter={(q: string, value: string) => {
          return optionTextByOptionValue[value].toLowerCase().includes(q.toLowerCase());
        }}
      >
        <AutoCompleteInput placeholder={placeholder} variant="filled" />

        <AutoCompleteList>
          {availableOptions.map(option => (
            <AutoCompleteItem key={option.value} value={option.value}>
              {option.label}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>

      {pendingSelections !== null && (
        <Text fontSize="sm" color="gray.500" mt="1">
          {pendingSelections > 0
            ? `${pendingSelections} ${
                pendingSelections > 1 ? 'selecciones disponibles' : 'selección disponible'
              }`
            : 'Sin selecciones disponibles'}
        </Text>
      )}
    </GridItem>
  );
}

type ValueTagProps = {
  onClick: () => void;
  primaryText: string;
};

const ValueTag = memo(function ValueTag({ onClick, primaryText }: ValueTagProps): JSX.Element {
  return (
    <Flex direction="column" bg="gray.200" rounded="md" overflow="hidden">
      <Flex justifyContent="space-between" alignItems="center" py="0.5" pl="2" pr="1">
        <Text fontSize="sm">{primaryText}</Text>

        <IconButton
          variant="ghost"
          colorScheme="red"
          aria-label="remove-item"
          icon={<MdClose />}
          rounded="full"
          size="xs"
          ml="3"
          onClick={onClick}
          minW="18px"
          minH="18px"
          w="18px"
          h="18px"
        />
      </Flex>
    </Flex>
  );
});
