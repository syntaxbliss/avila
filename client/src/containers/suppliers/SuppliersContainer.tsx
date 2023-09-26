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
import { MdAddCircleOutline, MdDelete, MdEdit, MdOutlineDelete } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import { QuerySortOrder, Supplier } from '../../__generated__/graphql';
import { useQueryFilteringAndPagination } from '../../hooks';
import SuppliersContainerFilters, { type SearchParams } from './SuppliersContainerFilters';

SuppliersContainer.gql = {
  queries: {
    suppliers: gql(`
      query SuppliersContainerSuppliersQuery ($searchParams: SearchSupplierInput, $pagination: PaginationInput) {
        suppliers (searchParams: $searchParams, pagination: $pagination) {
          paginationInfo {
            count
            pageNumber
            pageSize
          }
          items {
            id
            name
            address
            email
            phone
          }
        }
      }
    `),
  },
  mutations: {
    deleteSupplier: gql(`
      mutation SuppliersContainerDeleteSupplierMutation ($supplierId: ID!) {
        deleteSupplier (supplierId: $supplierId)
      }
    `),
  },
};

const defaultFilters: SearchParams = {
  name: '',
  sortOrder: QuerySortOrder.Asc,
};

export default function SuppliersContainer(): JSX.Element {
  const {
    onDebouncedSearchParamsChange,
    onImmediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  } = useQueryFilteringAndPagination<SearchParams>(defaultFilters);

  const suppliersQuery = useQuery(SuppliersContainer.gql.queries.suppliers, {
    fetchPolicy: 'network-only',
    variables: {
      ...queryVariables,
      searchParams: {
        ...queryVariables.searchParams,
        name: queryVariables.searchParams.name.trim(),
      },
    },
  });

  const [deleteSupplierMutation, deleteSupplierMutationStatus] = useMutation(
    SuppliersContainer.gql.mutations.deleteSupplier
  );

  const [toDelete, setToDelete] = useState<Partial<Supplier>>();
  const toast = useToast();
  const deleteDialog = useDisclosure({
    isOpen: Boolean(toDelete),
    onClose: () => setToDelete(undefined),
  });

  const handleDeleteSupplierClick = useCallback(() => {
    if (toDelete?.id) {
      deleteSupplierMutation({
        variables: { supplierId: toDelete.id },
        onCompleted() {
          toast({ description: 'Proveedor eliminado exitosamente.' });
          deleteDialog.onClose();
          suppliersQuery.refetch();
        },
      });
    }
  }, [toDelete?.id, deleteSupplierMutation, toast, deleteDialog, suppliersQuery]);

  return (
    <>
      <PageHeader title="Proveedores" />

      <Button
        as={Link}
        to={appRoutes.suppliers.create}
        colorScheme="orange"
        leftIcon={<MdAddCircleOutline />}
      >
        Nuevo proveedor
      </Button>

      <SuppliersContainerFilters
        onDebouncedChange={onDebouncedSearchParamsChange}
        onImmediateChange={onImmediateSearchParamsChange}
        onReset={onResetFilters}
        searchParams={searchParams}
      />

      <LoadingSpinner isVisible={suppliersQuery.loading} />

      {!suppliersQuery.loading && (
        <Card mt="8" p="2">
          {suppliersQuery.data?.suppliers.items.length ? (
            <>
              <TableContainer>
                <Box mt="4" mx="4">
                  <Pagination
                    {...suppliersQuery.data.suppliers.paginationInfo}
                    onChange={pagination => onPaginationChange(pagination)}
                  />
                </Box>

                <Divider my="5" />

                <Table size="sm" variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th>Nombre</Th>
                      <Th w="0" />
                    </Tr>
                  </Thead>

                  <Tbody>
                    {suppliersQuery.data.suppliers.items.map(supplier => (
                      <Tr key={supplier.id}>
                        <Td>{supplier.name}</Td>
                        <Td textAlign="center">
                          <IconButton
                            aria-label="edit"
                            colorScheme="blue"
                            rounded="full"
                            icon={<MdEdit />}
                            size="xs"
                            as={Link}
                            to={appRoutes.suppliers.edit.replace(':supplierId', supplier.id)}
                          />

                          <IconButton
                            aria-label="delete"
                            colorScheme="red"
                            rounded="full"
                            icon={<MdDelete />}
                            size="xs"
                            ml="1"
                            onClick={() => setToDelete(supplier)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <ConfirmationDialog
                confirmButtonColorScheme="red"
                confirmButtonIcon={<MdOutlineDelete />}
                confirmButtonText="Eliminar"
                isLoading={deleteSupplierMutationStatus.loading}
                isOpen={deleteDialog.isOpen}
                onClose={deleteDialog.onClose}
                onConfirm={handleDeleteSupplierClick}
                title="Eliminar proveedor"
              >
                ¿Confirma que desea eliminar el siguiente proveedor?
                <br />
                <br />
                <Text>
                  <b>Nombre:</b> {toDelete?.name}
                </Text>
              </ConfirmationDialog>
            </>
          ) : (
            <NoRecordsAlert entity="proveedores" />
          )}
        </Card>
      )}
    </>
  );
}
