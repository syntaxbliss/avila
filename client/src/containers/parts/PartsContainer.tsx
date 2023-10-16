import { useQuery } from '@apollo/client';
import { gql } from '../../__generated__';
import { QuerySortOrder, SearchPartQuerySortField } from '../../__generated__/graphql';
import { useQueryFilteringAndPagination } from '../../hooks';
import PartsContainerFilters, { type SearchParams } from './PartsContainerFilters';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Card, LoadingSpinner, NoRecordsAlert, PageHeader, Pagination } from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdDelete, MdEdit } from 'react-icons/md';

PartsContainer.gql = {
  queries: {
    parts: gql(`
      query PartsContainerPartsQuery ($searchParams: SearchPartInput, $pagination: PaginationInput) {
        parts (searchParams: $searchParams, pagination: $pagination) {
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
  // mutations: {
  //   deleteMaterial: gql(`
  //     mutation MaterialsContainerDeleteMaterialMutation ($materialId: ID!) {
  //       deleteMaterial (materialId: $materialId)
  //     }
  //   `),
  // },
};

const defaultFilters: SearchParams = {
  code: '',
  name: '',
  sortField: SearchPartQuerySortField.Name,
  sortOrder: QuerySortOrder.Asc,
};

export default function PartsContainer(): JSX.Element {
  const {
    onDebouncedSearchParamsChange,
    onImmediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  } = useQueryFilteringAndPagination<SearchParams>(defaultFilters);

  const partsQuery = useQuery(PartsContainer.gql.queries.parts, {
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

  // const [deleteMaterialMutation, deleteMaterialMutationStatus] = useMutation(
  //   MaterialsContainer.gql.mutations.deleteMaterial
  // );

  const toast = useToast();

  // const [toDelete, setToDelete] = useState<Partial<Material>>();
  // const deleteDialog = useDisclosure({
  //   isOpen: Boolean(toDelete),
  //   onClose: () => setToDelete(undefined),
  // });

  // const handleDeleteMaterialClick = useCallback(async () => {
  //   if (!toDelete?.id) {
  //     return;
  //   }

  //   try {
  //     await deleteMaterialMutation({ variables: { materialId: toDelete.id } });

  //     toast({ description: 'Material eliminado exitosamente.' });
  //     deleteDialog.onClose();
  //     materialsQuery.refetch();
  //   } catch (error) {
  //     if ((error as ApolloError).message.includes('foreign key constraint fails')) {
  //       toast({
  //         status: 'error',
  //         description:
  //           'El material seleccionado no puede eliminarse por tener otros registros asociados.',
  //       });
  //       deleteDialog.onClose();
  //     } else {
  //       throw new Error();
  //     }
  //   }
  // }, [toDelete?.id, deleteMaterialMutation, toast, deleteDialog, materialsQuery]);

  return (
    <>
      <PageHeader title="Partes" />

      <Button
        as={Link}
        to={appRoutes.parts.create}
        colorScheme="orange"
        leftIcon={<MdAddCircleOutline />}
      >
        Nueva parte
      </Button>

      <PartsContainerFilters
        onDebouncedChange={onDebouncedSearchParamsChange}
        onImmediateChange={onImmediateSearchParamsChange}
        onReset={onResetFilters}
        searchParams={searchParams}
      />

      <LoadingSpinner isVisible={partsQuery.loading} />

      {!partsQuery.loading && (
        <Card mt="8" p="2">
          {partsQuery.data?.parts.items.length ? (
            <>
              <TableContainer>
                <Box mt="4" mx="4">
                  <Pagination
                    {...partsQuery.data.parts.paginationInfo}
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
                    {partsQuery.data.parts.items.map(part => (
                      <Tr key={part.id}>
                        <Td textAlign="center">{part.code}</Td>
                        <Td>{part.name}</Td>
                        <Td textAlign="center">
                          <IconButton
                            aria-label="edit"
                            colorScheme="blue"
                            rounded="full"
                            icon={<MdEdit />}
                            size="xs"
                            as={Link}
                            to={appRoutes.parts.edit.replace(':partId', part.id)}
                          />

                          <IconButton
                            aria-label="delete"
                            colorScheme="red"
                            rounded="full"
                            icon={<MdDelete />}
                            size="xs"
                            ml="1"
                            // onClick={() => setToDelete(material)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* <ConfirmationDialog
                confirmButtonColorScheme="red"
                confirmButtonIcon={<MdOutlineDelete />}
                confirmButtonText="Eliminar"
                isLoading={deleteMaterialMutationStatus.loading}
                isOpen={deleteDialog.isOpen}
                onClose={deleteDialog.onClose}
                onConfirm={handleDeleteMaterialClick}
                title="Eliminar material"
              >
                ¿Confirma que desea eliminar el siguiente material?
                <br />
                <br />
                <Text>
                  <b>Código:</b> {toDelete?.code}
                </Text>
                <Text>
                  <b>Nombre:</b> {toDelete?.name}
                </Text>
              </ConfirmationDialog> */}
            </>
          ) : (
            <NoRecordsAlert entity="partes" />
          )}
        </Card>
      )}
    </>
  );
}
