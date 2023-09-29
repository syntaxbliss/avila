import { Divider, Grid, GridItem, IconButton, Text, useDisclosure } from '@chakra-ui/react';
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
  FormSelectOption,
  FormSwitch,
  PurchaseOrderMaterialsTable,
  SuspenseSpinner,
  type PurchaseOrderMaterialsTableRow,
} from '../../components';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';
import { gql } from '../../__generated__';
import { useQuery, useSuspenseQuery } from '@apollo/client';
import { MdAdd, MdOutlineRefresh, MdRefresh } from 'react-icons/md';
import { materialMeasureUnitAbbreviationByMaterialMeasureUnit } from '../../helpers';
import { Material, MaterialMeasureUnit } from '../../__generated__/graphql';

type Props = React.ComponentProps<typeof Card> & {
  onTotalAmountChange: (totalAmount: number) => void;
};

type Materials = {
  supplierId: string;
  updateStock: boolean;
  materials: Array<{
    materialId: string;
    quantity: number;
    unitPrice: number;
  }>;
};

export type PurchaseOrderFormContainerMaterialsHandler = () => Materials | undefined;

const PurchaseOrderFormContainerMaterials = forwardRef<
  PurchaseOrderFormContainerMaterialsHandler,
  Props
>(({ onTotalAmountChange, ...rest }, ref) => {
  return (
    <Card title="Materiales" {...rest}>
      <SuspenseSpinner>
        <PurchaseOrderFormContainerMaterialsContent
          ref={ref}
          onTotalAmountChange={onTotalAmountChange}
        />
      </SuspenseSpinner>
    </Card>
  );
});

const PurchaseOrderFormContainerMaterialsContentGql = {
  queries: {
    suppliers: gql(`
      query PurchaseOrderFormContainerMaterialsContentSuppliersQuery {
        suppliers {
          items {
            id
            name
          }
        }
      }
    `),
    supplier: gql(`
      query PurchaseOrderFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {
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

export default PurchaseOrderFormContainerMaterials;

type PurchaseOrderFormContainerMaterialsContentProps = {
  onTotalAmountChange: Props['onTotalAmountChange'];
};

type FormState = {
  materialId: string;
  quantity: string;
  unitPrice: string;
};

const formSchema = z.object({
  materialId: validationRules.string(true, 1, undefined),
  quantity: validationRules.decimal(0.01, 99999999.99),
  unitPrice: validationRules.decimal(0.01, 99999999.99),
});

const initialValues: FormState = { materialId: '', quantity: '', unitPrice: '' };

const PurchaseOrderFormContainerMaterialsContent = forwardRef<
  PurchaseOrderFormContainerMaterialsHandler,
  PurchaseOrderFormContainerMaterialsContentProps
>(({ onTotalAmountChange }, ref) => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [updateStock, setUpdateStock] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialValues });
  const [materialsList, setMaterialsList] = useState<Materials['materials']>([]);
  const [showEmptyListError, setShowEmptyListError] = useState(false);
  const materialSelectRef = useRef<HTMLSelectElement>(null);

  const changeSupplierDialog = useDisclosure();

  const { data } = useSuspenseQuery(
    PurchaseOrderFormContainerMaterialsContentGql.queries.suppliers,
    {
      fetchPolicy: 'network-only',
    }
  );

  const supplierQuery = useQuery(PurchaseOrderFormContainerMaterialsContentGql.queries.supplier, {
    fetchPolicy: 'network-only',
    variables: { supplierId: selectedSupplier },
    skip: !selectedSupplier,
  });

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

  const totalAmount = useMemo(() => {
    const totalAmount = (materialsList ?? []).reduce((sum, material) => {
      sum += material.quantity * material.unitPrice;

      return sum;
    }, 0);

    return Number(totalAmount.toFixed(2));
  }, [materialsList]);

  const handleAddClick = useCallback(() => {
    setMaterialsList(list => [
      ...list,
      {
        materialId: form.materialId,
        quantity: parseFloat(form.quantity),
        unitPrice: parseFloat(form.unitPrice),
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

  useEffect(() => {
    onTotalAmountChange(totalAmount);
  }, [onTotalAmountChange, totalAmount]);

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
          updateStock,
          materials: materialsList,
        };
      };
    },
    [materialsList, selectedSupplier, updateStock]
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

        <FormSwitch
          label="Actualizar existencias"
          value={updateStock}
          onChange={e => setUpdateStock(e)}
          id="purchase-order-form-container__update-stock"
          pt="34px"
        />
      </Grid>

      {materialsList.length > 0 && (
        <>
          <Divider my="5" />

          <PurchaseOrderMaterialsTable
            onDelete={handleDeleteClick}
            materials={materialsList.reduce((acc, m) => {
              const material = materialsByMaterialId[m.materialId];

              if (material) {
                acc.push({
                  code: material.code as string,
                  measureUnit: material.measureUnit as MaterialMeasureUnit,
                  name: material.name as string,
                  quantity: m.quantity,
                  unitPrice: m.unitPrice,
                });
              }

              return acc;
            }, [] as PurchaseOrderMaterialsTableRow[])}
          />
        </>
      )}

      <Divider my="5" />

      <Grid gridTemplateColumns="2fr 1fr 1fr auto" gap="5">
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
              materialMeasureUnitAbbreviationByMaterialMeasureUnit[
                materialsByMaterialId[form.materialId].measureUnit as MaterialMeasureUnit
              ]}
          </Text>
        </GridItem>

        <GridItem display="flex">
          <Text flex={0} minW="20px" mt="8">
            $
          </Text>

          <FormInputNumber
            isRequired
            label="Precio unitario"
            min={0.01}
            value={form.unitPrice}
            onChange={e => setForm({ ...form, unitPrice: e })}
            isDisabled={shouldDisableFormControls}
          />
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
