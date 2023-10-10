import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Card,
  ConfirmationDialog,
  FormInputNumber,
  FormSelect,
  RequestForQuotationMaterialsTable,
  SuspenseSpinner,
  type FormSelectOption,
  type RequestForQuotationMaterialsTableRow,
} from '../../components';
import { useQuery, useSuspenseQuery } from '@apollo/client';
import { z } from 'zod';
import { validationRules } from '../../validation/rules';
import { Divider, Grid, GridItem, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { Material, MaterialMeasureUnit } from '../../__generated__/graphql';
import { MdAdd, MdOutlineRefresh, MdRefresh } from 'react-icons/md';
import { materialMeasureUnitAbbreviationText } from '../../helpers';
import { gql } from '../../__generated__';
import _ from 'lodash';

type Props = React.ComponentProps<typeof Card>;

type Materials = {
  supplierId: string;
  materials: Array<{
    materialId: string;
    quantity: number;
  }>;
};

export type RequestForQuotationFormContainerMaterialsHandler = () => Materials | undefined;

const RequestForQuotationFormContainerMaterials = forwardRef<
  RequestForQuotationFormContainerMaterialsHandler,
  Props
>(({ ...rest }, ref) => {
  return (
    <Card title="Materiales" {...rest}>
      <SuspenseSpinner>
        <RequestForQuotationFormContainerMaterialsContent ref={ref} />
      </SuspenseSpinner>
    </Card>
  );
});

const RequestForQuotationFormContainerMaterialsContentGql = {
  queries: {
    suppliers: gql(`
      query RequestForQuotationFormContainerMaterialsContentSuppliersQuery {
        suppliers {
          items {
            id
            name
          }
        }
      }
    `),
    supplier: gql(`
      query RequestForQuotationFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {
        supplier (supplierId: $supplierId) {
          id
          materials {
            id
            code
            name
            measureUnit
          }
        }
      }
    `),
  },
};

export default RequestForQuotationFormContainerMaterials;

type FormState = {
  materialId: string;
  quantity: string;
};

const formSchema = z.object({
  materialId: validationRules.string(true, 1, undefined),
  quantity: validationRules.decimal(0.01, 99999999.99),
});

const initialValues: FormState = { materialId: '', quantity: '' };

const RequestForQuotationFormContainerMaterialsContent =
  forwardRef<RequestForQuotationFormContainerMaterialsHandler>((_props, ref) => {
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [form, setForm] = useState<FormState>({ ...initialValues });
    const [materialsList, setMaterialsList] = useState<Materials['materials']>([]);
    const [showEmptyListError, setShowEmptyListError] = useState(false);
    const materialSelectRef = useRef<HTMLSelectElement>(null);

    const changeSupplierDialog = useDisclosure();

    const { data } = useSuspenseQuery(
      RequestForQuotationFormContainerMaterialsContentGql.queries.suppliers,
      {
        fetchPolicy: 'network-only',
      }
    );

    const supplierQuery = useQuery(
      RequestForQuotationFormContainerMaterialsContentGql.queries.supplier,
      {
        fetchPolicy: 'network-only',
        variables: { supplierId: selectedSupplier },
        skip: !selectedSupplier,
      }
    );

    const materialsByMaterialId = useMemo(() => {
      if (!supplierQuery.data) {
        return {};
      }

      return supplierQuery.data.supplier.materials.reduce((obj, material) => {
        obj[material.id] = material;

        return obj;
      }, {} as Record<string, Partial<Material>>);
    }, [supplierQuery.data]);

    const supplierSelectOptions: FormSelectOption[] = useMemo(() => {
      return data.suppliers.items.map(supplier => ({
        label: supplier.name,
        value: supplier.id,
      }));
    }, [data.suppliers.items]);

    const materialsSelectOptions: FormSelectOption[] = useMemo(() => {
      return (supplierQuery.data?.supplier.materials || []).reduce((acc, material) => {
        const isAlreadySelected = materialsList.find(m => m.materialId === material.id);

        if (!isAlreadySelected) {
          acc.push({ label: `[${material.code}] ${material.name}`, value: material.id });
        }

        return acc;
      }, [] as FormSelectOption[]);
    }, [materialsList, supplierQuery.data?.supplier.materials]);

    const shouldDisableFormControls = useMemo(() => {
      return materialsSelectOptions.length === 0;
    }, [materialsSelectOptions]);

    const shouldDisableAddButton = useMemo(() => {
      const validation = formSchema.safeParse(_.cloneDeep(form));

      return !validation.success;
    }, [form]);

    const supplierSelectHelperText = useMemo(() => {
      if (selectedSupplier && !supplierQuery.loading) {
        const length = supplierQuery.data?.supplier.materials.length || 0;

        if (!length) {
          return 'No hay materiales asociados a este proveedor';
        }

        return `${length} material${length > 1 ? 'es' : ''} asociado${
          length > 1 ? 's' : ''
        } a este proveedor.`;
      }

      return undefined;
    }, [selectedSupplier, supplierQuery.data?.supplier.materials.length, supplierQuery.loading]);

    const handleAddClick = useCallback(() => {
      setMaterialsList(list => [
        ...list,
        {
          materialId: form.materialId,
          quantity: parseFloat(form.quantity),
        },
      ]);
      setForm({ ...initialValues });
      materialSelectRef.current?.focus();
    }, [form]);

    const handleDeleteClick = useCallback(
      (code: string) => {
        setMaterialsList(list => {
          const materialId = (supplierQuery.data?.supplier.materials || []).find(
            m => m.code === code
          )?.id;
          const index = list.findIndex(material => material.materialId === materialId);

          const newList = [...list];

          newList.splice(index, 1);

          return newList;
        });
      },
      [supplierQuery.data?.supplier.materials]
    );

    useEffect(() => {
      setMaterialsList([]);
      setForm({ ...initialValues });
    }, [selectedSupplier]);

    useImperativeHandle(
      ref,
      () => {
        return () => {
          setShowEmptyListError(false);

          if (!materialsList.length) {
            setShowEmptyListError(true);
            return undefined;
          }

          return {
            supplierId: selectedSupplier,
            materials: materialsList,
          };
        };
      },
      [materialsList, selectedSupplier]
    );

    return (
      <>
        <Grid gridTemplateColumns="1fr auto 1fr" gap="5">
          <FormSelect
            isRequired
            label="Proveedor"
            options={supplierSelectOptions}
            value={selectedSupplier}
            onChange={e => setSelectedSupplier(e.target.value)}
            isDisabled={materialsList.length > 0}
            helperText={supplierSelectHelperText}
          />

          <GridItem>
            <IconButton
              mt="8"
              aria-label="change"
              colorScheme="blue"
              rounded="full"
              icon={<MdRefresh />}
              size="xs"
              onClick={changeSupplierDialog.onOpen}
              isDisabled={!materialsList.length}
            />
          </GridItem>
        </Grid>

        {materialsList.length > 0 && (
          <>
            <Divider my="5" />

            <RequestForQuotationMaterialsTable
              onDelete={handleDeleteClick}
              materials={materialsList.reduce((acc, m) => {
                const material = materialsByMaterialId[m.materialId];

                if (material) {
                  acc.push({
                    code: material.code as string,
                    measureUnit: material.measureUnit as MaterialMeasureUnit,
                    name: material.name as string,
                    quantity: m.quantity,
                  });
                }

                return acc;
              }, [] as RequestForQuotationMaterialsTableRow[])}
            />
          </>
        )}

        <Divider my="5" />

        <Grid gridTemplateColumns="2fr 1fr auto" gap="5">
          <FormSelect
            ref={materialSelectRef}
            isRequired
            label="Material"
            options={materialsSelectOptions}
            value={form.materialId}
            onChange={e => setForm({ ...form, materialId: e.target.value })}
            isDisabled={shouldDisableFormControls}
          />

          <GridItem display="flex">
            <FormInputNumber
              isRequired
              label="Cantidad"
              min={0.01}
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e })}
              isDisabled={shouldDisableFormControls}
            />

            <Text flex={0} minW="25px" textAlign="right" mt="8">
              {materialsByMaterialId[form.materialId]?.measureUnit &&
                materialMeasureUnitAbbreviationText[
                  materialsByMaterialId[form.materialId].measureUnit as MaterialMeasureUnit
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
              onClick={handleAddClick}
              isDisabled={shouldDisableAddButton}
            />
          </GridItem>
        </Grid>

        {showEmptyListError && (
          <Text color="red.500" mt="2" fontSize="sm">
            No se agregaron materiales a lista.
          </Text>
        )}

        <ConfirmationDialog
          confirmButtonColorScheme="green"
          confirmButtonIcon={<MdOutlineRefresh />}
          confirmButtonText="Cambiar"
          isOpen={changeSupplierDialog.isOpen}
          onClose={changeSupplierDialog.onClose}
          onConfirm={() => {
            changeSupplierDialog.onClose();
            setSelectedSupplier('');
          }}
          title="Cambiar de proveedor"
        >
          ¿Confirma que desea seleccionar otro proveedor y crear una nueva lista de materiales?
        </ConfirmationDialog>
      </>
    );
  });
