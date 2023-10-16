import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import {
  AutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { Box, Flex, FormLabel, GridItem, HStack, IconButton, Text } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

export type FormAutocompleteOption = {
  label: string;
  value: string;
};
export type FormAutocompleteGroups = Record<string, FormAutocompleteOption[]>;

export type FormAutocompleteHandler = {
  focusInput: () => void;
};

type Props = {
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isRequired?: boolean;
  label?: string;
  maxSelections?: number;
  multiple?: boolean;
  onChange: (values: string[]) => void;
  options: FormAutocompleteOption[] | FormAutocompleteGroups;
  placeholder?: string;
  value: string[];
};

const FormAutocomplete = forwardRef<FormAutocompleteHandler, Props>(
  (
    {
      gridColumn,
      isRequired,
      label,
      maxSelections,
      multiple,
      onChange,
      options,
      placeholder,
      value,
    },
    ref
  ) => {
    const isGrouped = useMemo(() => !Array.isArray(options), [options]);
    const innerRef = useRef<HTMLInputElement>(null);

    const availableOptions = useMemo(() => {
      if (isGrouped) {
        return Object.entries(options as FormAutocompleteGroups).reduce(
          (obj, [groupName, groupOptions]) => {
            obj[groupName] = groupOptions.filter(option => !value.includes(option.value));

            return obj;
          },
          {} as FormAutocompleteGroups
        );
      }

      return (options as FormAutocompleteOption[]).filter(i => !value.includes(i.value));
    }, [value, options, isGrouped]);

    const optionTextByOptionValue: Record<string, string> = useMemo(() => {
      if (isGrouped) {
        return Object.values(options as FormAutocompleteGroups).reduce((obj, groupOptions) => {
          groupOptions.forEach(option => {
            const { label, value } = option;

            obj[value] = label;
          });

          return obj;
        }, {} as Record<string, string>);
      }

      return (options as FormAutocompleteOption[]).reduce((obj, option) => {
        const { label, value } = option;

        obj[value] = label;

        return obj;
      }, {} as Record<string, string>);
    }, [options, isGrouped]);

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

    useImperativeHandle(ref, () => ({ focusInput: () => innerRef.current?.focus() }), []);

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
          <AutoCompleteInput placeholder={placeholder} variant="filled" ref={innerRef} />

          <AutoCompleteList>
            {isGrouped
              ? Object.entries(availableOptions as FormAutocompleteGroups).map(
                  ([groupName, groupOptions]) => (
                    <AutoCompleteGroup key={groupName}>
                      <GroupTitle name={groupName} />

                      {groupOptions.map(option => (
                        <AutoCompleteItem
                          key={option.value}
                          value={option.value}
                          textTransform="capitalize"
                        >
                          {option.label}
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteGroup>
                  )
                )
              : (availableOptions as FormAutocompleteOption[]).map(option => (
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
);

export default FormAutocomplete;

type GroupTitleProps = {
  name: string;
};

const GroupTitle = memo(function GroupTitleProps({ name }: GroupTitleProps): JSX.Element {
  return (
    <AutoCompleteGroupTitle position="relative" mr="5">
      <Box
        position="absolute"
        top="50%"
        left={0}
        right={0}
        height="1px"
        bg="orange.500"
        transform="translateY(-50%)"
      />

      <Flex justifyContent="center" w="full">
        <Text
          as="span"
          bg="white"
          fontSize="xs"
          color="orange.500"
          letterSpacing="wider"
          position="relative"
          px="2"
          textAlign="center"
        >
          {name}

          <Box position="absolute" inset={0} />
        </Text>
      </Flex>
    </AutoCompleteGroupTitle>
  );
});

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
