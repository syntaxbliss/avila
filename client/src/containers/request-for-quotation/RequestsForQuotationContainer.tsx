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
} from '@chakra-ui/react';
import { gql } from '../../__generated__';
import {
  QuerySortOrder,
  RequestForQuotationStatus,
  SearchRequestForQuotationStatus,
} from '../../__generated__/graphql';
import { useQueryFilteringAndPagination } from '../../hooks';
import RequestsForQuotationContainerFilters, {
  type SearchParams,
} from './RequestsForQuotationContainerFilters';
import _ from 'lodash';
import dayjs from 'dayjs';
import { LoadingSpinner, NoRecordsAlert, PageHeader, Pagination } from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdList, MdMarkEmailRead } from 'react-icons/md';
import { humanReadableDate, paymentMethodAbbreviationByPaymentMethod } from '../../helpers';
import { useQuery } from '@apollo/client';

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
};

const defaultFilters: SearchParams = {
  orderedAtFrom: '',
  orderedAtTo: '',
  supplierId: '',
  status: SearchRequestForQuotationStatus.All,
  sortOrder: QuerySortOrder.Desc,
};

export default function RequestsForQuotationContainer(): JSX.Element {
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
                        <Tr key={requestForQuotation.id}>
                          <Td textAlign="center">
                            {humanReadableDate(requestForQuotation.orderedAt)}
                          </Td>
                          <Td textAlign="center">
                            {requestForQuotation.status === RequestForQuotationStatus.Answered ? (
                              'Contestada'
                            ) : (
                              <Text color="red.500" fontWeight="bold">
                                Sin contestar
                              </Text>
                            )}
                          </Td>
                          <Td>{requestForQuotation.supplier.name}</Td>
                          <Td textAlign="center">
                            {
                              paymentMethodAbbreviationByPaymentMethod[
                                requestForQuotation.paymentMethod
                              ]
                            }
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="detail"
                              colorScheme="green"
                              rounded="full"
                              icon={<MdList />}
                              size="xs"
                              onClick={() => {}}
                            />

                            <IconButton
                              aria-label="answered"
                              colorScheme="purple"
                              rounded="full"
                              icon={<MdMarkEmailRead />}
                              size="xs"
                              ml="1"
                              onClick={() => {}}
                              isDisabled={
                                requestForQuotation.status === RequestForQuotationStatus.Answered
                              }
                            />
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <NoRecordsAlert entity="pedidos de cotización" />
          )}
        </Card>
      )}
    </>
  );
}
