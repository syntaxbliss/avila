import {
  Box,
  Button,
  Card,
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
import { gql } from '../../__generated__';
import {
  QuerySortOrder,
  RequestForQuotation,
  RequestForQuotationStatus,
  SearchRequestForQuotationStatus,
} from '../../__generated__/graphql';
import { useQueryFilteringAndPagination } from '../../hooks';
import RequestsForQuotationContainerFilters, {
  type SearchParams,
} from './RequestsForQuotationContainerFilters';
import _ from 'lodash';
import dayjs from 'dayjs';
import {
  ConfirmationDialog,
  LoadingSpinner,
  NoRecordsAlert,
  PageHeader,
  Pagination,
} from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import { appRoutes } from '../../routes';
import {
  MdAddCircleOutline,
  MdClose,
  MdList,
  MdMarkEmailRead,
  MdShoppingCart,
} from 'react-icons/md';
import { humanReadableDate, paymentMethodText, requestForQuotationStatusText } from '../../helpers';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import RequestForQuotationAnswerForm from './RequestForQuotationAnswerForm';
import RequestForQuotationContainerDetail from './RequestForQuotationContainerDetail';

RequestsForQuotationContainer.gql = {
  queries: {
    requestsForQuotation: gql(`
      query RequestsForQuotationContainerRequestsForQuotationQuery ($searchParams: SearchRequestForQuotationInput, $pagination: PaginationInput) {
        requestsForQuotation (searchParams: $searchParams, pagination: $pagination) {
          paginationInfo {
            count
            pageNumber
            pageSize
          }
          items {
            id
            orderedAt
            paymentMethod
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
    cancelRequestForQuotation: gql(`
      mutation RequestsForQuotationContainerCancelRequestForQuotationMutation ($requestForQuotationId: ID!) {
        cancelRequestForQuotation (requestForQuotationId: $requestForQuotationId)
      }
    `),
  },
};

const defaultFilters: SearchParams = {
  orderedAtFrom: '',
  orderedAtTo: '',
  supplierId: '',
  status: SearchRequestForQuotationStatus.AnsweredAndUnanswered,
  sortOrder: QuerySortOrder.Desc,
};

export default function RequestsForQuotationContainer(): JSX.Element {
  const navigate = useNavigate();
  const {
    onImmediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  } = useQueryFilteringAndPagination<SearchParams>(defaultFilters);

  const requestsForQuotationQuery = useQuery(
    RequestsForQuotationContainer.gql.queries.requestsForQuotation,
    {
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
    }
  );

  const [cancelRequestForQuotationMutation, cancelRequestForQuotationMutationStatus] = useMutation(
    RequestsForQuotationContainer.gql.mutations.cancelRequestForQuotation
  );

  const toast = useToast();

  const [toAnswer, setToAnswer] = useState<string>();
  const answerDialog = useDisclosure({
    isOpen: Boolean(toAnswer),
    onClose: () => setToAnswer(undefined),
  });

  const [showDetail, setShowDetail] = useState<string>();
  const detailDialog = useDisclosure({
    isOpen: Boolean(showDetail),
    onClose: () => setShowDetail(undefined),
  });

  const [toCancel, setToCancel] = useState<Partial<RequestForQuotation>>();
  const cancelDialog = useDisclosure({
    isOpen: Boolean(toCancel),
    onClose: () => setToCancel(undefined),
  });

  const handleCancelRequestForQuotationClick = useCallback(async () => {
    if (toCancel?.id) {
      const response = await cancelRequestForQuotationMutation({
        variables: { requestForQuotationId: toCancel.id },
      });

      if (response.data?.cancelRequestForQuotation) {
        toast({ description: 'Pedido de cotización anulado exitosamente.' });
        cancelDialog.onClose();
        requestsForQuotationQuery.refetch();
      }
    }
  }, [cancelDialog, cancelRequestForQuotationMutation, requestsForQuotationQuery, toCancel, toast]);

  return (
    <>
      <PageHeader title="Pedidos de cotización" />

      <Button
        as={Link}
        to={appRoutes.requestsForQuotation.create}
        colorScheme="orange"
        leftIcon={<MdAddCircleOutline />}
      >
        Nuevo pedido de cotización
      </Button>

      <RequestsForQuotationContainerFilters
        onImmediateChange={onImmediateSearchParamsChange}
        onReset={onResetFilters}
        searchParams={searchParams}
      />

      <LoadingSpinner isVisible={requestsForQuotationQuery.loading} />

      {!requestsForQuotationQuery.loading && (
        <Card mt="8" p="2">
          {requestsForQuotationQuery.data?.requestsForQuotation.items.length ? (
            <>
              <TableContainer>
                <Box mt="4" mx="4">
                  <Pagination
                    {...requestsForQuotationQuery.data.requestsForQuotation.paginationInfo}
                    onChange={pagination => onPaginationChange(pagination)}
                  />
                </Box>

                <Divider my="5" />

                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th textAlign="center" w="20%">
                        Fecha de pedido
                      </Th>
                      <Th textAlign="center" w="20%">
                        Estado
                      </Th>
                      <Th w="60%">Proveedor</Th>
                      <Th textAlign="center" w="20%">
                        Forma de pago
                      </Th>
                      <Th w="0" />
                    </Tr>
                  </Thead>

                  <Tbody>
                    {requestsForQuotationQuery.data.requestsForQuotation.items.map(
                      requestForQuotation => (
                        <Tr
                          key={requestForQuotation.id}
                          bgColor={
                            requestForQuotation.status === RequestForQuotationStatus.Cancelled
                              ? 'red.200'
                              : undefined
                          }
                        >
                          <Td textAlign="center">
                            {humanReadableDate(requestForQuotation.orderedAt)}
                          </Td>
                          <Td textAlign="center">
                            {requestForQuotation.status === RequestForQuotationStatus.Answered ? (
                              requestForQuotationStatusText[requestForQuotation.status]
                            ) : (
                              <Text color="red.500" fontWeight="bold">
                                {requestForQuotationStatusText[requestForQuotation.status]}
                              </Text>
                            )}
                          </Td>
                          <Td>{requestForQuotation.supplier.name}</Td>
                          <Td textAlign="center">
                            {paymentMethodText[requestForQuotation.paymentMethod]}
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="detail"
                              colorScheme="green"
                              rounded="full"
                              icon={<MdList />}
                              size="xs"
                              onClick={() => setShowDetail(requestForQuotation.id)}
                            />

                            <IconButton
                              aria-label="answered"
                              colorScheme="purple"
                              rounded="full"
                              icon={<MdMarkEmailRead />}
                              size="xs"
                              ml="1"
                              onClick={() => setToAnswer(requestForQuotation.id)}
                              isDisabled={[
                                RequestForQuotationStatus.Cancelled,
                                RequestForQuotationStatus.Answered,
                              ].includes(requestForQuotation.status)}
                            />

                            <IconButton
                              aria-label="purchase-order"
                              colorScheme="yellow"
                              rounded="full"
                              icon={<MdShoppingCart />}
                              size="xs"
                              ml="1"
                              onClick={() =>
                                navigate(
                                  `${appRoutes.purchaseOrders.create}?rfqId=${requestForQuotation.id}`
                                )
                              }
                              isDisabled={[
                                RequestForQuotationStatus.Cancelled,
                                RequestForQuotationStatus.Unanswered,
                              ].includes(requestForQuotation.status)}
                            />

                            <IconButton
                              aria-label="cancel"
                              colorScheme="red"
                              rounded="full"
                              icon={<MdClose />}
                              size="xs"
                              ml="1"
                              onClick={() =>
                                setToCancel(requestForQuotation as RequestForQuotation)
                              }
                              isDisabled={
                                requestForQuotation.status === RequestForQuotationStatus.Cancelled
                              }
                            />
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>

              <RequestForQuotationAnswerForm
                isOpen={answerDialog.isOpen}
                onClose={answerDialog.onClose}
                onConfirm={() => {
                  answerDialog.onClose();
                  requestsForQuotationQuery.refetch();
                }}
                requestForQuotationId={toAnswer}
              />

              <RequestForQuotationContainerDetail
                isOpen={detailDialog.isOpen}
                onClose={detailDialog.onClose}
                requestForQuotationId={showDetail}
              />

              <ConfirmationDialog
                confirmButtonColorScheme="red"
                confirmButtonIcon={<MdClose />}
                confirmButtonText="Anular"
                isLoading={cancelRequestForQuotationMutationStatus.loading}
                isOpen={cancelDialog.isOpen}
                onClose={cancelDialog.onClose}
                onConfirm={handleCancelRequestForQuotationClick}
                title="Anular pedido de cotización"
              >
                ¿Confirma que desea anular el siguiente pedido de cotización?
                <br />
                <br />
                <Text>
                  <b>Fecha de pedido:</b> {toCancel ? humanReadableDate(toCancel.orderedAt) : null}
                </Text>
                <Text>
                  <b>Forma de pago:</b>{' '}
                  {toCancel?.paymentMethod ? paymentMethodText[toCancel.paymentMethod] : null}
                </Text>
                <Text>
                  <b>Proveedor:</b> {toCancel?.supplier?.name}
                </Text>
              </ConfirmationDialog>
            </>
          ) : (
            <NoRecordsAlert entity="pedidos de cotización" />
          )}
        </Card>
      )}
    </>
  );
}
