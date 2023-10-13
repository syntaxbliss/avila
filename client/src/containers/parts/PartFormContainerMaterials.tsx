import { z } from 'zod';
import { validationRules } from '../../validation/rules';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Divider, Grid, GridItem, IconButton, Text } from '@chakra-ui/react';
import {
  Card,
  FormAutocomplete,
  FormInputNumber,
  FormInputText,
  RequestForQuotationMaterialsTable,
  SuspenseSpinner,
  type FormAutocompleteHandler,
  type FormAutocompleteOption,
  type RequestForQuotationMaterialsTableRow,
} from '../../components';
import { gql } from '../../__generated__';
import { MdAdd, MdClose } from 'react-icons/md';
import { useSuspenseQuery } from '@apollo/client';
import _ from 'lodash';
import { Material, MeasureUnit } from '../../__generated__/graphql';
import { measureUnitAbbreviationText } from '../../helpers';

type Props = React.ComponentProps<typeof Card>;

type Materials = Array<{ materialId: string; quantity: number }>;

export type PartFormContainerMaterialsHandler = () => Materials | undefined;

const PartFormContainerMaterials = forwardRef<PartFormContainerMaterialsHandler, Props>(
  ({ ...rest }, ref) => {
    return (
      <Card title="Materiales" {...rest}>
        <SuspenseSpinner>
          <PartFormContainerMaterialsContent ref={ref} />
        </SuspenseSpinner>
      </Card>
    );
  }
);

export default PartFormContainerMaterials;

const PartFormContainerMaterialsContentGql = {
  queries: {
    materials: gql(`
      query PartFormContainerMaterialsContentMaterialsQuery {
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
  },
};

type FormState = {
  materialId: string;
  quantity: string;
};

const formSchema = z.object({
  materialId: validationRules.string(true, 1, undefined),
  quantity: validationRules.decimal(0.01, 99999999.99),
});

const initialValues: FormState = { materialId: '', quantity: '' };

const PartFormContainerMaterialsContent = forwardRef<PartFormContainerMaterialsHandler>(
  (_props, ref) => {
    const {
      data: { materials },
    } = useSuspenseQuery(PartFormContainerMaterialsContentGql.queries.materials);

    const autocompleteRef = useRef<FormAutocompleteHandler | null>(null);
    const quantityInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<FormState>({ ...initialValues });
    const [materialsList, setMaterialsList] = useState<Materials>([]);
    const [showEmptyListError, setShowEmptyListError] = useState(false);

    const autocompleteOtions: FormAutocompleteOption[] = useMemo(() => {
      return materials.items.reduce((acc, material) => {
        const alreadyAdded = materialsList.find(m => m.materialId === material.id);

        if (!alreadyAdded) {
          acc.push({ label: `[${material.code}] ${material.name}`, value: material.id });
        }

        return acc;
      }, [] as FormAutocompleteOption[]);
    }, [materials, materialsList]);

    const materialsByMaterialId = useMemo(() => {
      return materials.items.reduce((obj, material) => {
        obj[material.id] = material;

        return obj;
      }, {} as Record<string, Partial<Material>>);
    }, [materials.items]);

    const shouldDisableAddButton = useMemo(() => {
      const validation = formSchema.safeParse(_.cloneDeep(form));

      return !validation.success;
    }, [form]);

    useImperativeHandle(
      ref,
      () => {
        return () => {
          setShowEmptyListError(false);

          if (!materialsList.length) {
            setShowEmptyListError(true);

            return undefined;
          }

          return materialsList;
        };
      },
      [materialsList]
    );

    return (
      <>
        {materialsList.length > 0 && (
          <>
            <RequestForQuotationMaterialsTable
              onDelete={(code: string) => {
                setMaterialsList(list => {
                  const materialId = materials.items.find(m => m.code === code)?.id;
                  const index = list.findIndex(material => material.materialId === materialId);

                  const newList = [...list];

                  newList.splice(index, 1);

                  return newList;
                });
              }}
              materials={materialsList.reduce((acc, m) => {
                const material = materialsByMaterialId[m.materialId];

                if (material) {
                  acc.push({
                    code: material.code as string,
                    measureUnit: material.measureUnit as MeasureUnit,
                    name: material.name as string,
                    quantity: m.quantity,
                  });
                }

                return acc;
              }, [] as RequestForQuotationMaterialsTableRow[])}
            />

            <Divider my="5" />
          </>
        )}

        <Grid gridTemplateColumns="repeat(4, 1fr) auto" gap="5">
          {form.materialId ? (
            <FormInputText
              gridColumn="1 / 4"
              isRequired
              label="Material"
              value={
                autocompleteOtions.find(option => option.value === form.materialId)?.label ?? ''
              }
              onChange={_.noop}
              rightElement={{
                ariaLabel: 'remove',
                color: 'red.500',
                icon: MdClose,
                onClick: () => setForm({ ...form, materialId: '' }),
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
              label="Material"
              multiple
              options={autocompleteOtions}
              value={[]}
              onChange={e => {
                setForm({ ...form, materialId: e[0] });
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
              {materialsByMaterialId[form.materialId]?.measureUnit &&
                measureUnitAbbreviationText[
                  materialsByMaterialId[form.materialId].measureUnit as MeasureUnit
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
                setMaterialsList(list => {
                  const newList = [...list];
                  const parsedData = formSchema.parse(_.cloneDeep(form));

                  newList.push({
                    materialId: parsedData.materialId,
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
            No se agregaron materiales a lista.
          </Text>
        )}
      </>
    );
  }
);
