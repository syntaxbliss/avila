import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Grid,
  GridItem,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UseDisclosureProps,
  useDisclosure,
} from '@chakra-ui/react';
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
  FormInputNumber,
  FormSelect,
  FormSelectOption,
  FormSwitch,
  SuspenseSpinner,
} from '../../components';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';
import { gql } from '../../__generated__';
import { useQuery, useSuspenseQuery } from '@apollo/client';
import { MdAdd, MdDelete, MdOutlineRefresh, MdRefresh } from 'react-icons/md';
import {
  formatCurrency,
  formatMaterialQuantity,
  materialMeasureUnitAbbreviationByMaterialMeasureUnit,
} from '../../helpers';
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

  const changeSupplierDialog = useDisclosure();

  const { data } = useSuspenseQuery(
    PurchaseOrderFormContainerMaterialsContentGql.queries.suppliers,
    {
      fetchPolicy: 'network-only',
    }
  );

  const supplierQuery = useQuery(PurchaseOrderFormContainerMaterialsContentGql.queries.supplier, {
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
  }, [form]);

  const handleDeleteClick = useCallback((index: number) => {
    setMaterialsList(list => {
      const newList = [...list];

      newList.splice(index, 1);

      return newList;
    });
  }, []);

  const handleChangeSupplierClick = useCallback(() => {
    changeSupplierDialog.onClose();
    setSelectedSupplier('');
  }, [changeSupplierDialog]);

  useEffect(() => {
    if (!selectedSupplier) {
      setMaterialsList([]);
      setForm({ ...initialValues });
    }
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
          isDisabled={Boolean(selectedSupplier)}
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
            onClick={
              materialsList.length ? changeSupplierDialog.onOpen : () => setSelectedSupplier('')
            }
            isDisabled={!selectedSupplier}
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

          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th w="25%">Material</Th>
                  <Th w="25%" textAlign="center">
                    Cantidad
                  </Th>
                  <Th w="25%" textAlign="center">
                    Precio unitario
                  </Th>
                  <Th w="25%" textAlign="center">
                    Subtotal
                  </Th>
                  <Th />
                </Tr>
              </Thead>

              <Tbody>
                {materialsList.map((m, index) => {
                  const material = materialsByMaterialId[m.materialId];

                  return (
                    material && (
                      <SelectedMatrialTableRow
                        key={material.id}
                        code={material.code as string}
                        measureUnit={material.measureUnit as MaterialMeasureUnit}
                        name={material.name as string}
                        onDelete={() => handleDeleteClick(index)}
                        quantity={m.quantity}
                        unitPrice={m.unitPrice}
                      />
                    )
                  );
                })}

                <Tr bgColor="gray.700">
                  <Td colSpan={4} textAlign="right">
                    <Text
                      fontWeight="bold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      color="whiteAlpha.800"
                    >
                      <Text as="span">Total:</Text> {formatCurrency(totalAmount)}
                    </Text>
                  </Td>
                  <Td />
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}

      <Divider my="5" />

      <Grid gridTemplateColumns="2fr 1fr 1fr auto" gap="5">
        <FormSelect
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

      <ChangeSupplierDialog {...changeSupplierDialog} onConfirm={handleChangeSupplierClick} />
    </>
  );
});

type SelectedMaterialTableRowProps = {
  code: string;
  measureUnit: MaterialMeasureUnit;
  name: string;
  onDelete: () => void;
  quantity: number;
  unitPrice: number;
};

function SelectedMatrialTableRow({
  code,
  measureUnit,
  name,
  onDelete,
  quantity,
  unitPrice,
}: SelectedMaterialTableRowProps): JSX.Element {
  return (
    <Tr>
      <Td>{`[${code}] ${name}`}</Td>
      <Td textAlign="center">{formatMaterialQuantity(quantity, measureUnit)}</Td>
      <Td textAlign="right">{formatCurrency(unitPrice)}</Td>
      <Td textAlign="right">{formatCurrency(quantity * unitPrice)}</Td>
      <Td>
        <IconButton
          aria-label="delete"
          colorScheme="red"
          rounded="full"
          icon={<MdDelete />}
          size="xs"
          onClick={onDelete}
        />
      </Td>
    </Tr>
  );
}

type ChangeSupplierDialogProps = {
  isOpen: NonNullable<UseDisclosureProps['isOpen']>;
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  onConfirm: () => void;
};

function ChangeSupplierDialog({
  isOpen,
  onClose,
  onConfirm,
}: ChangeSupplierDialogProps): JSX.Element {
  const cancelRef = useRef(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cambiar de proveedor
          </AlertDialogHeader>

          <AlertDialogBody>
            ¿Confirma que desea seleccionar otro proveedor y crear una nueva lista de materiales?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>

            <Button colorScheme="green" onClick={onConfirm} ml="3" leftIcon={<MdOutlineRefresh />}>
              Cambiar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default PurchaseOrderFormContainerMaterials;
