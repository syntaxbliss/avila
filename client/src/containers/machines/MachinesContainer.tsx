import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { gql } from '../../__generated__';
import { Machine, QuerySortOrder, SearchMachineQuerySortField } from '../../__generated__/graphql';
import { useQueryFilteringAndPagination } from '../../hooks';
import MachinesContainerFilters, { type SearchParams } from './MachinesContainerFilters';
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
import { useCallback, useState } from 'react';
import {
  ConfirmationDialog,
  LoadingSpinner,
  NoRecordsAlert,
  PageHeader,
  Pagination,
} from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdDelete, MdEdit, MdOutlineDelete } from 'react-icons/md';

MachinesContainer.gql = {
  queries: {
    machines: gql(`
      query MachinesContainerMachinesQuery ($searchParams: SearchMachineInput, $pagination: PaginationInput) {
        machines (searchParams: $searchParams, pagination: $pagination) {
          paginationInfo {
            count
            pageNumber
            pageSize
          }
          items {
            id
            name
            code
          }
        }
      }
    `),
  },
  mutations: {
    deleteMachine: gql(`
      mutation MachinesContainerDeleteMachineMutation ($machineId: ID!) {
        deleteMachine (machineId: $machineId)
      }
    `),
  },
};

const defaultFilters: SearchParams = {
  code: '',
  name: '',
  sortField: SearchMachineQuerySortField.Name,
  sortOrder: QuerySortOrder.Asc,
};

export default function MachinesContainer(): JSX.Element {
  const {
    onDebouncedSearchParamsChange,
    onImmediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  } = useQueryFilteringAndPagination<SearchParams>(defaultFilters);

  const machinesQuery = useQuery(MachinesContainer.gql.queries.machines, {
    fetchPolicy: 'network-only',
    variables: {
      ...queryVariables,
      searchParams: {
        ...queryVariables.searchParams,
        code: queryVariables.searchParams.code.trim(),
        name: queryVariables.searchParams.name.trim(),
      },
    },
  });

  const [deleteMachineMutation, deleteMachineMutationStatus] = useMutation(
    MachinesContainer.gql.mutations.deleteMachine
  );

  const toast = useToast();

  const [toDelete, setToDelete] = useState<Partial<Machine>>();
  const deleteDialog = useDisclosure({
    isOpen: Boolean(toDelete),
    onClose: () => setToDelete(undefined),
  });

  const handleDeleteMachineClick = useCallback(async () => {
    if (!toDelete?.id) {
      return;
    }

    try {
      await deleteMachineMutation({ variables: { machineId: toDelete.id } });

      toast({ description: 'Máquina eliminada exitosamente.' });
      deleteDialog.onClose();
      machinesQuery.refetch();
    } catch (error) {
      if ((error as ApolloError).message.includes('foreign key constraint fails')) {
        toast({
          status: 'error',
          description:
            'La máquina seleccionada no puede eliminarse por tener otros registros asociados.',
        });
        deleteDialog.onClose();
      } else {
        throw new Error();
      }
    }
  }, [toDelete?.id, deleteMachineMutation, toast, deleteDialog, machinesQuery]);

  return (
    <>
      <PageHeader title="Máquinas" />

      <Button
        as={Link}
        to={appRoutes.machines.create}
        colorScheme="orange"
        leftIcon={<MdAddCircleOutline />}
      >
        Nueva máquina
      </Button>

      <MachinesContainerFilters
        onDebouncedChange={onDebouncedSearchParamsChange}
        onImmediateChange={onImmediateSearchParamsChange}
        onReset={onResetFilters}
        searchParams={searchParams}
      />

      <LoadingSpinner isVisible={machinesQuery.loading} />

      {!machinesQuery.loading && (
        <Card mt="8" p="2">
          {machinesQuery.data?.machines.items.length ? (
            <>
              <TableContainer>
                <Box mt="4" mx="4">
                  <Pagination
                    {...machinesQuery.data.machines.paginationInfo}
                    onChange={pagination => onPaginationChange(pagination)}
                  />
                </Box>

                <Divider my="5" />

                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th textAlign="center" w="0">
                        Código
                      </Th>
                      <Th w="100%">Nombre</Th>
                      <Th w="0" />
                    </Tr>
                  </Thead>

                  <Tbody>
                    {machinesQuery.data.machines.items.map(machine => (
                      <Tr key={machine.id}>
                        <Td textAlign="center">{machine.code}</Td>
                        <Td>{machine.name}</Td>
                        <Td textAlign="center">
                          <IconButton
                            aria-label="edit"
                            colorScheme="blue"
                            rounded="full"
                            icon={<MdEdit />}
                            size="xs"
                            as={Link}
                            to={appRoutes.machines.edit.replace(':machineId', machine.id)}
                          />

                          <IconButton
                            aria-label="delete"
                            colorScheme="red"
                            rounded="full"
                            icon={<MdDelete />}
                            size="xs"
                            ml="1"
                            onClick={() => setToDelete(machine)}
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
                isLoading={deleteMachineMutationStatus.loading}
                isOpen={deleteDialog.isOpen}
                onClose={deleteDialog.onClose}
                onConfirm={handleDeleteMachineClick}
                title="Eliminar máquina"
              >
                ¿Confirma que desea eliminar la siguiente máquina?
                <br />
                <br />
                <Text>
                  <b>Código:</b> {toDelete?.code}
                </Text>
                <Text>
                  <b>Nombre:</b> {toDelete?.name}
                </Text>
              </ConfirmationDialog>
            </>
          ) : (
            <NoRecordsAlert entity="máquinas" />
          )}
        </Card>
      )}
    </>
  );
}
