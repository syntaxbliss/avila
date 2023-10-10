import { gql } from '../../__generated__';
import { ConfirmationDialog, FormInputNumber, SuspenseSpinner } from '../../components';
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { MdCheck } from 'react-icons/md';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { formatCurrency, formatMaterialQuantity, humanReadableDate } from '../../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';

RequestForQuotationAnswerForm.gql = {
  mutations: {
    saveAnswer: gql(`
      mutation RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutation (
        $requestForQuotationId: ID!,
        $input: SaveRequestForQuotationAnswerInput!
      ) {
        saveRequestForQuotationAnswer (requestForQuotationId: $requestForQuotationId, input: $input)
      }
    `),
  },
};

type Props = {
  isOpen: React.ComponentProps<typeof ConfirmationDialog>['isOpen'];
  onClose: React.ComponentProps<typeof ConfirmationDialog>['onClose'];
  onConfirm: React.ComponentProps<typeof ConfirmationDialog>['onConfirm'];
  requestForQuotationId?: string;
};

type MaterialsListState = Array<{ materialId: string; unitPrice: string }>;

const numberSchema = validationRules.decimal(0.01, 99999999.99);

export default function RequestForQuotationAnswerForm({
  isOpen,
  onClose,
  onConfirm,
  requestForQuotationId,
}: Props): JSX.Element {
  const toast = useToast();

  const [materials, setMaterials] = useState<MaterialsListState>([]);

  const shouldDisableConfirmButton = useMemo(() => {
    if (!materials.length) {
      return true;
    }

    return !materials.every(item => {
      const validation = numberSchema.safeParse(item.unitPrice);

      return validation.success;
    });
  }, [materials]);

  const [saveAnswerMutation, saveAnswerMutationStatus] = useMutation(
    RequestForQuotationAnswerForm.gql.mutations.saveAnswer
  );

  const handleChange = useCallback((list: MaterialsListState) => {
    setMaterials(list);
  }, []);

  const handleSaveClick = useCallback(async () => {
    if (!requestForQuotationId) {
      return;
    }

    const materialsList = materials.map(material => ({
      materialId: material.materialId,
      unitPrice: numberSchema.parse(material.unitPrice) as number,
    }));

    const response = await saveAnswerMutation({
      variables: {
        requestForQuotationId,
        input: { materials: materialsList },
      },
    });

    if (response.data?.saveRequestForQuotationAnswer) {
      toast({ description: 'Respuesta registrada exitosamente.' });
      onConfirm();
    }
  }, [saveAnswerMutation, materials, requestForQuotationId, toast, onConfirm]);

  useEffect(() => {
    setMaterials([]);
  }, [requestForQuotationId]);

  return (
    <ConfirmationDialog
      confirmButtonColorScheme="green"
      confirmButtonDisabled={shouldDisableConfirmButton}
      confirmButtonIcon={<MdCheck />}
      confirmButtonText="Guardar"
      isLoading={saveAnswerMutationStatus.loading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSaveClick}
      size="4xl"
      title="Cargar respuesta de pedido de cotización"
    >
      {requestForQuotationId && (
        <SuspenseSpinner>
          <RequestForQuotationAnswerFormContent
            onChange={handleChange}
            requestForQuotationId={requestForQuotationId}
          />
        </SuspenseSpinner>
      )}
    </ConfirmationDialog>
  );
}

RequestForQuotationAnswerFormContent.gql = {
  queries: {
    requestForQuotation: gql(`
      query RequestForQuotationAnswerFormContentRequestForQuotationQuery ($requestForQuotationId: ID!) {
        requestForQuotation (requestForQuotationId: $requestForQuotationId) {
          id
          orderedAt
          paymentMethod
          supplier {
            id
            name
          }
          materials {
            material {
              id
              code
              name
              measureUnit
            }
            quantity
          }
        }
      }
    `),
  },
};

type RequestForQuotationAnswerFormContentProps = {
  onChange: (list: MaterialsListState) => void;
  requestForQuotationId: string;
};

function RequestForQuotationAnswerFormContent({
  onChange,
  requestForQuotationId,
}: RequestForQuotationAnswerFormContentProps): JSX.Element | null {
  const {
    data: { requestForQuotation },
  } = useSuspenseQuery(RequestForQuotationAnswerFormContent.gql.queries.requestForQuotation, {
    fetchPolicy: 'network-only',
    variables: { requestForQuotationId },
  });

  const [unitPricesList, setUnitPricesList] = useState<string[]>(
    Array.from({ length: requestForQuotation.materials.length }, () => '')
  );

  const getSubtotal = useCallback((input: string, qty: number) => {
    const validation = numberSchema.safeParse(input);

    if (validation.success) {
      return formatCurrency((validation.data || 0) * qty);
    }

    return null;
  }, []);

  const totalAmount = useMemo(() => {
    return unitPricesList.reduce((sum, item, index) => {
      const validation = numberSchema.safeParse(item);

      if (validation.success) {
        sum += (validation.data || 0) * requestForQuotation.materials[index].quantity;
      }

      return sum;
    }, 0);
  }, [unitPricesList, requestForQuotation.materials]);

  useEffect(() => {
    const list = unitPricesList.map((unitPrice, index) => ({
      unitPrice,
      materialId: requestForQuotation.materials[index].material.id,
    }));

    onChange(list);
  }, [onChange, unitPricesList, requestForQuotation.materials]);

  return (
    <>
      <Text>
        <b>Proveedor:</b> {requestForQuotation.supplier.name}
      </Text>
      <Text>
        <b>Fecha de pedido:</b> {humanReadableDate(requestForQuotation.orderedAt)}
      </Text>

      <TableContainer mt="8">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th w="40%">Material</Th>
              <Th textAlign="center" w="20%">
                Cantidad
              </Th>
              <Th textAlign="center" w="20%">
                Precio unitario
              </Th>
              <Th textAlign="center" w="20%">
                Subtotal
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {requestForQuotation.materials.map((material, index) => (
              <Tr key={material.material.code}>
                <Td>{`[${material.material.code}] ${material.material.name}`}</Td>
                <Td textAlign="center">
                  {formatMaterialQuantity(material.quantity, material.material.measureUnit)}
                </Td>
                <Td textAlign="center">
                  <Flex alignItems="center">
                    <Text flex={0} minW="20px">
                      $
                    </Text>

                    <FormInputNumber
                      min={0.01}
                      value={unitPricesList[index]}
                      onChange={e =>
                        setUnitPricesList(list => {
                          const newList = _.cloneDeep(list);

                          newList[index] = e;

                          return newList;
                        })
                      }
                    />
                  </Flex>
                </Td>

                <Td textAlign="right">
                  <Text>{getSubtotal(unitPricesList[index], material.quantity)}</Text>
                </Td>
              </Tr>
            ))}

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
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
