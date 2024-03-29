import {
  Box,
  Button,
  Divider,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  Card,
  ConfirmationDialog,
  LoadingSpinner,
  NoRecordsAlert,
  PageHeader,
  Pagination,
} from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import {
  MdAddCircleOutline,
  MdDelete,
  MdList,
  MdLocalShipping,
  MdOutlineDelete,
  MdPayments,
  MdPrint,
} from 'react-icons/md';
import { gql } from '../../__generated__';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { formatCurrency, humanReadableDate } from '../../helpers';
import {
  PurchaseOrder,
  QuerySortOrder,
  SearchPurchaseOrderDeliveryStatus,
  SearchPurchaseOrderPaymentStatus,
  SearchPurchaseOrderQuerySortField,
} from '../../__generated__/graphql';
import _ from 'lodash';
import { useQueryFilteringAndPagination } from '../../hooks';
import PurchaseOrdersContainerFilters, {
  type SearchParams,
} from './PurchaseOrdersContainerFilters';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import PurchaseOrdersContainerDetail from './PurchaseOrdersContainerDetail';
import PurchaseOrdersContainerOrderDeliveredForm from './PurchaseOrdersContainerOrderDeliveredForm';
import PurchaseOrdersContainerRegisterPaymentForm from './PurchaseOrdersContainerRegisterPaymentForm';

PurchaseOrdersContainer.gql = {
  queries: {
    purchaseOrders: gql(`
      query PurchaseOrdersContainerPurchaseOrdersQuery ($searchParams: SearchPurchaseOrderInput, $pagination: PaginationInput) {
        purchaseOrders (searchParams: $searchParams, pagination: $pagination) {
          paginationInfo {
            count
            pageNumber
            pageSize
          }
          items {
            id
            orderNumber
            orderedAt
            deliveredAt
            totalAmount
            paidAmount
            supplier {
              id
              name
            }
          }
        }
      }
    `),
  },

  mutations: {
    deletePurchaseOrder: gql(`
      mutation PurchaseOrdersContainerDeletePurchaseOrderMutation ($purchaseOrderId: ID!) {
        deletePurchaseOrder (purchaseOrderId: $purchaseOrderId)
      }
    `),

    printPurchaseOrder: gql(`
      mutation PurchaseOrdersContainerPrintPurchaseOrderMutation ($purchaseOrderId: ID!) {
        printPurchaseOrder (purchaseOrderId: $purchaseOrderId)
      }
    `),
  },
};

const defaultFilters: SearchParams = {
  orderNumber: '',
  orderedAtFrom: '',
  orderedAtTo: '',
  supplierId: '',
  paymentStatus: SearchPurchaseOrderPaymentStatus.All,
  deliveryStatus: SearchPurchaseOrderDeliveryStatus.All,
  sortField: SearchPurchaseOrderQuerySortField.OrderedAt,
  sortOrder: QuerySortOrder.Desc,
};

export default function PurchaseOrdersContainer(): JSX.Element {
  const {
    onDebouncedSearchParamsChange,
    onImmediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  } = useQueryFilteringAndPagination<SearchParams>(defaultFilters);

  const purchaseOrdersQuery = useQuery(PurchaseOrdersContainer.gql.queries.purchaseOrders, {
    fetchPolicy: 'network-only',
    variables: {
      ...queryVariables,
      searchParams: {
        ..._.omit(queryVariables.searchParams, ['orderedAtFrom', 'orderedAtTo', 'orderNumber']),
        ...(queryVariables.searchParams.orderNumber &&
        Number.isSafeInteger(parseInt(queryVariables.searchParams.orderNumber, 10)) &&
        parseInt(queryVariables.searchParams.orderNumber, 10) > 0
          ? { orderNumber: parseInt(queryVariables.searchParams.orderNumber, 10) }
          : {}),
        ...(queryVariables.searchParams.orderedAtFrom
          ? { orderedAtFrom: dayjs(queryVariables.searchParams.orderedAtFrom).toDate() }
          : {}),
        ...(queryVariables.searchParams.orderedAtTo
          ? { orderedAtTo: dayjs(queryVariables.searchParams.orderedAtTo).toDate() }
          : {}),
      },
    },
  });

  const [deletePurchaseOrderMutation, deletePurchaseOrderMutationStatus] = useMutation(
    PurchaseOrdersContainer.gql.mutations.deletePurchaseOrder
  );

  const [printPurchaseOrderMutation, printPurchaseOrderMutationStatus] = useMutation(
    PurchaseOrdersContainer.gql.mutations.printPurchaseOrder
  );

  const toast = useToast();

  const [toDelete, setToDelete] = useState<Partial<PurchaseOrder>>();
  const deleteDialog = useDisclosure({
    isOpen: Boolean(toDelete),
    onClose: () => setToDelete(undefined),
  });

  const [toFlagAsDelivered, setToFlagAsDelivered] = useState<PurchaseOrder>();
  const flagAsDeliveredDialog = useDisclosure({
    isOpen: Boolean(toFlagAsDelivered),
    onClose: () => setToFlagAsDelivered(undefined),
  });

  const [toRegisterPayment, setToRegisterPayment] = useState<PurchaseOrder>();
  const registerPaymentDialog = useDisclosure({
    isOpen: Boolean(toRegisterPayment),
    onClose: () => setToRegisterPayment(undefined),
  });

  const [showDetail, setShowDetail] = useState<string>();
  const detailDialog = useDisclosure({
    isOpen: Boolean(showDetail),
    onClose: () => setShowDetail(undefined),
  });

  const handleDeletePurchaseOrderClick = useCallback(async () => {
    if (toDelete?.id) {
      try {
        await deletePurchaseOrderMutation({ variables: { purchaseOrderId: toDelete.id } });

        toast({ description: 'Orden de compra eliminada exitosamente.' });
        deleteDialog.onClose();
        purchaseOrdersQuery.refetch();
      } catch (error) {
        if ((error as ApolloError).message.includes('foreign key constraint fails')) {
          toast({
            status: 'error',
            description:
              'La orden de compra seleccionada no puede eliminarse por tener otros registros asociados.',
          });
          deleteDialog.onClose();
        } else {
          throw new Error();
        }
      }
    }
  }, [deleteDialog, deletePurchaseOrderMutation, purchaseOrdersQuery, toDelete, toast]);

  const handlePrintClick = useCallback(
    async (purchaseOrderId: string) => {
      const response = await printPurchaseOrderMutation({ variables: { purchaseOrderId } });

      if (response.data?.printPurchaseOrder) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = '';
        link.href = response.data?.printPurchaseOrder;
        link.click();
      }
    },
    [printPurchaseOrderMutation]
  );

  return (
    <>
      <PageHeader title="Órdenes de compra" />

      <Button
        as={Link}
        to={appRoutes.purchaseOrders.create}
        colorScheme="orange"
        leftIcon={<MdAddCircleOutline />}
      >
        Nueva orden de compra
      </Button>

      <PurchaseOrdersContainerFilters
        onDebouncedChange={onDebouncedSearchParamsChange}
        onImmediateChange={onImmediateSearchParamsChange}
        onReset={onResetFilters}
        searchParams={searchParams}
      />

      <LoadingSpinner isVisible={purchaseOrdersQuery.loading} />

      {!purchaseOrdersQuery.loading && (
        <Card mt="8" p="2">
          {purchaseOrdersQuery.data?.purchaseOrders.items.length ? (
            <>
              <TableContainer>
                <Box mt="4" mx="4">
                  <Pagination
                    {...purchaseOrdersQuery.data.purchaseOrders.paginationInfo}
                    onChange={pagination => onPaginationChange(pagination)}
                  />
                </Box>

                <Divider my="5" />

                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th textAlign="center" w="0">
                        #
                      </Th>
                      <Th textAlign="center" w="20%">
                        Fecha de pedido
                      </Th>
                      <Th textAlign="center" w="20%">
                        Fecha de entrega
                      </Th>
                      <Th w="20%">Proveedor</Th>
                      <Th textAlign="center" w="20%">
                        Total a pagar
                      </Th>
                      <Th textAlign="center" w="20%">
                        Total abonado
                      </Th>
                      <Th w="0" />
                    </Tr>
                  </Thead>

                  <Tbody>
                    {purchaseOrdersQuery.data.purchaseOrders.items.map(purchaseOrder => (
                      <Tr key={purchaseOrder.id}>
                        <Td textAlign="center">{purchaseOrder.orderNumber}</Td>
                        <Td textAlign="center">{humanReadableDate(purchaseOrder.orderedAt)}</Td>
                        <Td textAlign="center">
                          {purchaseOrder.deliveredAt ? (
                            humanReadableDate(purchaseOrder.deliveredAt)
                          ) : (
                            <Text color="red.500" fontWeight="bold">
                              No entregada
                            </Text>
                          )}
                        </Td>
                        <Td>{purchaseOrder.supplier.name}</Td>
                        <Td textAlign="right">
                          <Text fontWeight="bold">{formatCurrency(purchaseOrder.totalAmount)}</Text>
                        </Td>
                        <Td textAlign="right">
                          <Text
                            fontWeight="bold"
                            color={
                              purchaseOrder.totalAmount - purchaseOrder.paidAmount === 0
                                ? 'green.500'
                                : purchaseOrder.paidAmount === 0
                                ? 'red.500'
                                : 'yellow.500'
                            }
                          >
                            {formatCurrency(purchaseOrder.paidAmount)}
                          </Text>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="detail"
                            colorScheme="green"
                            rounded="full"
                            icon={<MdList />}
                            size="xs"
                            onClick={() => setShowDetail(purchaseOrder.id)}
                          />

                          <IconButton
                            aria-label="delivered"
                            colorScheme="purple"
                            rounded="full"
                            icon={<MdLocalShipping />}
                            size="xs"
                            ml="1"
                            onClick={() => setToFlagAsDelivered(purchaseOrder as PurchaseOrder)}
                            isDisabled={Boolean(purchaseOrder.deliveredAt)}
                          />

                          <IconButton
                            aria-label="register-payment"
                            colorScheme="yellow"
                            rounded="full"
                            icon={<MdPayments />}
                            size="xs"
                            ml="1"
                            onClick={() => setToRegisterPayment(purchaseOrder as PurchaseOrder)}
                            isDisabled={purchaseOrder.totalAmount - purchaseOrder.paidAmount === 0}
                          />

                          <IconButton
                            aria-label="print"
                            colorScheme="blue"
                            rounded="full"
                            icon={<MdPrint />}
                            size="xs"
                            ml="1"
                            onClick={() => handlePrintClick(purchaseOrder.id)}
                            isLoading={printPurchaseOrderMutationStatus.loading}
                          />

                          <IconButton
                            aria-label="delete"
                            colorScheme="red"
                            rounded="full"
                            icon={<MdDelete />}
                            size="xs"
                            ml="1"
                            onClick={() => setToDelete(purchaseOrder as PurchaseOrder)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <PurchaseOrdersContainerDetail
                isOpen={detailDialog.isOpen}
                onClose={detailDialog.onClose}
                purchaseOrderId={showDetail}
              />

              <ConfirmationDialog
                confirmButtonColorScheme="red"
                confirmButtonIcon={<MdOutlineDelete />}
                confirmButtonText="Eliminar"
                isLoading={deletePurchaseOrderMutationStatus.loading}
                isOpen={deleteDialog.isOpen}
                onClose={deleteDialog.onClose}
                onConfirm={handleDeletePurchaseOrderClick}
                title="Eliminar orden de compra"
              >
                ¿Confirma que desea eliminar la siguiente orden de compra?
                <br />
                <br />
                <Text>
                  <b>Proveedor:</b> {toDelete?.supplier?.name}
                </Text>
                <Text>
                  <b>Fecha de pedido:</b> {toDelete ? humanReadableDate(toDelete.orderedAt) : null}
                </Text>
                {toDelete?.deliveredAt && (
                  <Text>
                    <b>Fecha de entrega:</b>{' '}
                    {toDelete ? humanReadableDate(toDelete.deliveredAt) : null}
                  </Text>
                )}
              </ConfirmationDialog>

              <PurchaseOrdersContainerOrderDeliveredForm
                isOpen={flagAsDeliveredDialog.isOpen}
                onClose={flagAsDeliveredDialog.onClose}
                onConfirm={() => {
                  flagAsDeliveredDialog.onClose();
                  purchaseOrdersQuery.refetch();
                }}
                purchaseOrder={toFlagAsDelivered}
              />

              <PurchaseOrdersContainerRegisterPaymentForm
                isOpen={registerPaymentDialog.isOpen}
                onClose={registerPaymentDialog.onClose}
                onConfirm={() => {
                  registerPaymentDialog.onClose();
                  purchaseOrdersQuery.refetch();
                }}
                purchaseOrder={toRegisterPayment}
              />
            </>
          ) : (
            <NoRecordsAlert entity="órdenes de compra" />
          )}
        </Card>
      )}
    </>
  );
}
