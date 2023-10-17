import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Machine,
  MachineElementElementType,
  Material,
  MeasureUnit,
  Part,
} from '../../__generated__/graphql';
import {
  Card,
  MachineElementsTable,
  SuspenseSpinner,
  type FormAutocompleteGroups,
  type FormAutocompleteHandler,
  type FormAutocompleteOption,
  type MachineElementsTableRow,
  FormInputText,
  FormAutocomplete,
  FormInputNumber,
} from '../../components';
import { gql } from '../../__generated__';
import { z } from 'zod';
import { validationRules } from '../../validation/rules';
import { useSuspenseQuery } from '@apollo/client';
import _ from 'lodash';
import { Divider, Grid, GridItem, IconButton, Text } from '@chakra-ui/react';
import { MdAdd, MdClose } from 'react-icons/md';
import { measureUnitAbbreviationText } from '../../helpers';

type Props = React.ComponentProps<typeof Card> & {
  machine?: Machine;
};

type Elements = Array<{
  elementType: MachineElementElementType;
  elementId: string;
  quantity: number;
}>;

export type MachineFormContainerElementsHandler = () => Elements | undefined;

const MachineFormContainerElements = forwardRef<MachineFormContainerElementsHandler, Props>(
  ({ machine, ...rest }, ref) => {
    return (
      <Card title="Componentes" {...rest}>
        <SuspenseSpinner>
          <MachineFormContainerElementsContent ref={ref} machine={machine} />
        </SuspenseSpinner>
      </Card>
    );
  }
);

export default MachineFormContainerElements;

const MachineFormContainerElementsContentGql = {
  queries: {
    materials: gql(`
      query MachineFormContainerElementsContentMaterialsQuery {
        materials {
          items {
            id
            name
            code
            measureUnit
          }
        }
      }
    `),
    parts: gql(`
      query MachineFormContainerElementsContentPartsQuery {
        parts {
          items {
            id
            name
            code
          }
        }
      }
    `),
  },
};

type FormState = {
  elementId: string;
  quantity: string;
};

const formSchema = z.object({
  elementId: validationRules.string(true, 1, undefined),
  quantity: validationRules.decimal(0.01, 99999999.99),
});

const initialValues: FormState = { elementId: '', quantity: '' };

const MachineFormContainerElementsContent = forwardRef<MachineFormContainerElementsHandler, Props>(
  ({ machine }, ref) => {
    const {
      data: { materials },
    } = useSuspenseQuery(MachineFormContainerElementsContentGql.queries.materials);

    const {
      data: { parts },
    } = useSuspenseQuery(MachineFormContainerElementsContentGql.queries.parts);

    const autocompleteRef = useRef<FormAutocompleteHandler | null>(null);
    const quantityInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<FormState>({ ...initialValues });
    const [elementsList, setElementsList] = useState<Elements>(
      machine?.elements.map(me => ({
        elementType:
          'measureUnit' in me.element
            ? MachineElementElementType.Material
            : MachineElementElementType.Part,
        elementId: me.element.id,
        quantity: me.quantity,
      })) ?? []
    );
    const [showEmptyListError, setShowEmptyListError] = useState(false);

    const autocompleteOptions: FormAutocompleteGroups = useMemo(() => {
      const materialsOptions: FormAutocompleteOption[] = materials.items.map(material => ({
        label: `[${material.code}] ${material.name}`,
        value: material.id,
      }));

      const partsOptions: FormAutocompleteOption[] = parts.items.map(part => ({
        label: `[${part.code}] ${part.name}`,
        value: part.id,
      }));

      const filteringCallback = (option: FormAutocompleteOption) =>
        !elementsList.some(e => e.elementId === option.value);

      return {
        Materiales: materialsOptions.filter(filteringCallback),
        Partes: partsOptions.filter(filteringCallback),
      };
    }, [materials.items, parts.items, elementsList]);

    const elementsByElementId = useMemo(() => {
      return [...materials.items, ...parts.items].reduce((obj, element) => {
        obj[element.id] = element;

        return obj;
      }, {} as Record<string, Partial<Material | Part>>);
    }, [materials.items, parts.items]);

    const shouldDisableAddButton = useMemo(() => {
      const validation = formSchema.safeParse(_.cloneDeep(form));

      return !validation.success;
    }, [form]);

    useImperativeHandle(
      ref,
      () => {
        return () => {
          setShowEmptyListError(false);

          if (!elementsList.length) {
            setShowEmptyListError(true);

            return undefined;
          }

          return elementsList;
        };
      },
      [elementsList]
    );

    return (
      <>
        {elementsList.length > 0 && (
          <>
            <MachineElementsTable
              onDelete={(elementId: string) => {
                setElementsList(list => {
                  const index = list.findIndex(element => element.elementId === elementId);

                  const newList = [...list];

                  newList.splice(index, 1);

                  return newList;
                });
              }}
              elements={elementsList.reduce((acc, e) => {
                const element = elementsByElementId[e.elementId];

                if (element) {
                  acc.push({
                    code: element.code as string,
                    elementId: element.id as string,
                    elementType:
                      'measureUnit' in element
                        ? MachineElementElementType.Material
                        : MachineElementElementType.Part,
                    measureUnit: (element as Material).measureUnit,
                    name: element.name as string,
                    quantity: e.quantity,
                  });
                }

                return acc;
              }, [] as MachineElementsTableRow[])}
            />

            <Divider my="5" />
          </>
        )}

        <Grid gridTemplateColumns="repeat(4, 1fr) auto" gap="5">
          {form.elementId ? (
            <FormInputText
              gridColumn="1 / 4"
              isRequired
              label="Componente"
              value={
                Object.values(autocompleteOptions)
                  .flat()
                  .find(option => option.value === form.elementId)?.label ?? ''
              }
              onChange={_.noop}
              rightElement={{
                ariaLabel: 'remove',
                color: 'red.500',
                icon: MdClose,
                onClick: () => setForm({ ...form, elementId: '' }),
              }}
            />
          ) : (
            <FormAutocomplete
              ref={e => {
                if (e) {
                  autocompleteRef.current = e;
                }
              }}
              gridColumn="1 / 4"
              isRequired
              label="Componente"
              multiple
              options={autocompleteOptions}
              value={[]}
              onChange={e => {
                setForm({ ...form, elementId: e[0] });
                setTimeout(() => quantityInputRef.current?.focus(), 100);
              }}
            />
          )}

          <GridItem display="flex">
            <FormInputNumber
              ref={quantityInputRef}
              isRequired
              label="Cantidad"
              min={0.01}
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e })}
            />

            <Text flex={0} minW="25px" textAlign="right" mt="8">
              {form.elementId &&
                measureUnitAbbreviationText[
                  (elementsByElementId[form.elementId] as Material)?.measureUnit ?? MeasureUnit.Unit
                ]}
            </Text>
          </GridItem>

          <GridItem>
            <IconButton
              mt="8"
              aria-label="add"
              colorScheme="green"
              rounded="full"
              icon={<MdAdd />}
              size="xs"
              onClick={() => {
                setElementsList(list => {
                  const newList = [...list];
                  const parsedData = formSchema.parse(_.cloneDeep(form));

                  newList.push({
                    elementType: materials.items.some(m => m.id === parsedData.elementId)
                      ? MachineElementElementType.Material
                      : MachineElementElementType.Part,
                    elementId: parsedData.elementId,
                    quantity: parsedData.quantity as number,
                  });

                  return newList;
                });
                setForm({ ...initialValues });
                setTimeout(() => autocompleteRef.current?.focusInput(), 100);
              }}
              isDisabled={shouldDisableAddButton}
            />
          </GridItem>
        </Grid>

        {showEmptyListError && (
          <Text color="red.500" mt="2" fontSize="sm">
            No se agregaron componentes a lista.
          </Text>
        )}
      </>
    );
  }
);
