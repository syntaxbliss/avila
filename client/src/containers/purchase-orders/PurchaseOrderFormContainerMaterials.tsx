import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Flex,
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

type Props = React.ComponentProps<typeof Card>;

type Materials = {
  supplierId: string;
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
>(({ ...rest }, ref) => {
  return (
    <Card title="Materiales" {...rest}>
      <SuspenseSpinner>
        <PurchaseOrderFormContainerMaterialsContent ref={ref} />
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

const PurchaseOrderFormContainerMaterialsContent =
  forwardRef<PurchaseOrderFormContainerMaterialsHandler>((_props, ref) => {
    const [selectedSupplier, setSelectedSupplier] = useState('');
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
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5">
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
        </Grid>

        <Divider my="5" />

        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th w="50%">Material</Th>
                <Th w="25%" textAlign="center">
                  Cantidad
                </Th>
                <Th w="25%" textAlign="center">
                  Precio unitario
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

              <Tr>
                <Td>
                  <FormSelect
                    options={materialsSelectOptions}
                    value={form.materialId}
                    onChange={e => setForm({ ...form, materialId: e.target.value })}
                    isDisabled={shouldDisableFormControls}
                  />
                </Td>

                <Td>
                  <Flex alignItems="center">
                    <FormInputNumber
                      min={0.01}
                      value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: e })}
                      isDisabled={shouldDisableFormControls}
                    />
                    <Text flex={0} minW="25px" textAlign="right">
                      {materialsByMaterialId[form.materialId]?.measureUnit &&
                        materialMeasureUnitAbbreviationByMaterialMeasureUnit[
                          materialsByMaterialId[form.materialId].measureUnit as MaterialMeasureUnit
                        ]}
                    </Text>
                  </Flex>
                </Td>

                <Td>
                  <Flex alignItems="center">
                    <Text flex={0} minW="20px">
                      $
                    </Text>
                    <FormInputNumber
                      min={0.01}
                      value={form.unitPrice}
                      onChange={e => setForm({ ...form, unitPrice: e })}
                      isDisabled={shouldDisableFormControls}
                    />
                  </Flex>
                </Td>

                <Td>
                  <IconButton
                    aria-label="add"
                    colorScheme="green"
                    rounded="full"
                    icon={<MdAdd />}
                    size="xs"
                    onClick={handleAddClick}
                    isDisabled={shouldDisableAddButton}
                  />
                </Td>
              </Tr>
              <Tr />
            </Tbody>
          </Table>

          {showEmptyListError && (
            <Text color="red.500" mt="2" fontSize="sm">
              No se agregaron materiales a lista.
            </Text>
          )}
        </TableContainer>

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
