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
import { MdAddCircleOutline, MdClose, MdList } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useMutation, useQuery } from '@apollo/client';
import { formatCurrency, humanReadableDate } from '../../helpers';
import {
  PurchaseOrder,
  PurchaseOrderStatus,
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
            orderedAt
            deliveredAt
            totalAmount
            paidAmount
            status
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
    cancelPurchaseOrder: gql(`
      mutation PurchaseOrdersContainerCancelPurchaseOrderMutation ($purchaseOrderId: ID!) {
        cancelPurchaseOrder (purchaseOrderId: $purchaseOrderId)
      }
    `),
  },
};

const defaultFilters: SearchParams = {
  orderedAtFrom: '',
  orderedAtTo: '',
  supplierId: '',
  paymentStatus: SearchPurchaseOrderPaymentStatus.All,
  deliveryStatus: SearchPurchaseOrderDeliveryStatus.All,
  status: PurchaseOrderStatus.Active,
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
        ..._.omit(queryVariables.searchParams, ['orderedAtFrom', 'orderedAtTo']),
        ...(queryVariables.searchParams.orderedAtFrom
          ? { orderedAtFrom: dayjs(queryVariables.searchParams.orderedAtFrom).toDate() }
          : {}),
        ...(queryVariables.searchParams.orderedAtTo
          ? { orderedAtTo: dayjs(queryVariables.searchParams.orderedAtTo).toDate() }
          : {}),
      },
    },
  });

  const [cancelPurchaseOrderMutation, cancelPurchaseOrderMutationStatus] = useMutation(
    PurchaseOrdersContainer.gql.mutations.cancelPurchaseOrder
  );

  const [toCancel, setToCancel] = useState<Partial<PurchaseOrder>>();
  const toast = useToast();
  const cancelDialog = useDisclosure({
    isOpen: Boolean(toCancel),
    onClose: () => setToCancel(undefined),
  });

  const [showDetail, setShowDetail] = useState<string>();
  const detailDialog = useDisclosure({
    isOpen: Boolean(showDetail),
    onClose: () => setShowDetail(undefined),
  });

  const handleCancelPurchaseOrderClick = useCallback(() => {
    if (toCancel?.id) {
      cancelPurchaseOrderMutation({
        variables: { purchaseOrderId: toCancel.id },
        onCompleted() {
          toast({ description: 'Orden de compra anulada exitosamente.' });
          cancelDialog.onClose();
          purchaseOrdersQuery.refetch();
        },
      });
    }
  }, [cancelDialog, cancelPurchaseOrderMutation, purchaseOrdersQuery, toCancel, toast]);

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

                <Table
                  size="sm"
                  {...(searchParams?.status === PurchaseOrderStatus.Cancelled
                    ? {}
                    : { variant: 'striped', colorScheme: 'gray' })}
                >
                  <Thead>
                    <Tr>
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
                      <Tr
                        key={purchaseOrder.id}
                        bgColor={
                          purchaseOrder.status === PurchaseOrderStatus.Cancelled
                            ? 'red.200'
                            : undefined
                        }
                      >
                        <Td textAlign="center">{humanReadableDate(purchaseOrder.orderedAt)}</Td>
                        <Td textAlign="center">
                          {purchaseOrder.deliveredAt ? (
                            humanReadableDate(purchaseOrder.deliveredAt)
                          ) : (
                            <Text color="red.500" fontWeight="bold">
                              Sin entregar
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
                            aria-label="delete"
                            colorScheme="red"
                            rounded="full"
                            icon={<MdClose />}
                            size="xs"
                            ml="1"
                            onClick={() => setToCancel(purchaseOrder as PurchaseOrder)}
                            isDisabled={purchaseOrder.status === PurchaseOrderStatus.Cancelled}
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
                confirmButtonIcon={<MdClose />}
                confirmButtonText="Anular"
                isLoading={cancelPurchaseOrderMutationStatus.loading}
                isOpen={cancelDialog.isOpen}
                onClose={cancelDialog.onClose}
                onConfirm={handleCancelPurchaseOrderClick}
                title="Anular orden de compra"
              >
                ¿Confirma que desea anular la siguiente orden de compra?
                <br />
                <br />
                <Text>
                  <b>Proveedor:</b> {toCancel?.supplier?.name}
                </Text>
                <Text>
                  <b>Fecha de pedido:</b> {toCancel ? humanReadableDate(toCancel.orderedAt) : null}
                </Text>
                {toCancel?.deliveredAt && (
                  <Text>
                    <b>Fecha de entrega:</b>{' '}
                    {toCancel ? humanReadableDate(toCancel.deliveredAt) : null}
                  </Text>
                )}
              </ConfirmationDialog>
            </>
          ) : (
            <NoRecordsAlert entity="órdenes de compra" />
          )}
        </Card>
      )}
    </>
  );
}
