import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Spinner,
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
import { Card, DeleteDialog, NoRecordsAlert, PageHeader, Pagination } from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdDelete, MdEdit } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useMutation, useQuery } from '@apollo/client';
import { formatMaterialQuantity } from '../../helpers';
import { useCallback, useState } from 'react';
import {
  Material,
  QuerySortOrder,
  SearchMaterialQuerySortField,
} from '../../__generated__/graphql';
import _ from 'lodash';
import { useQueryFilteringAndPagination } from '../../hooks';
import MaterialsContainerFilters, { type SearchParams } from './MaterialsContainerFilters';

MaterialsContainer.gql = {
  queries: {
    materials: gql(`
      query MaterialsContainerMaterialsQuery ($searchParams: SearchMaterialInput, $pagination: PaginationInput) {
        materials (searchParams: $searchParams, pagination: $pagination) {
          paginationInfo {
            count
            pageNumber
            pageSize
          }
          items {
            id
            name
            code
            measureUnit
            currentQuantity
            alertQuantity
          }
        }
      }
    `),
  },
  mutations: {
    deleteMaterial: gql(`
      mutation MaterialsContainerDeleteMaterialMutation ($materialId: ID!) {
        deleteMaterial (materialId: $materialId)
      }
    `),
  },
};

const defaultFilters: SearchParams = {
  code: '',
  name: '',
  lowQuantity: false,
  sortField: SearchMaterialQuerySortField.Name,
  sortOrder: QuerySortOrder.Asc,
};

export default function MaterialsContainer(): JSX.Element {
  const {
    onDebouncedSearchParamsChange,
    onImmediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  } = useQueryFilteringAndPagination<SearchParams>(defaultFilters);

  const materialsQuery = useQuery(MaterialsContainer.gql.queries.materials, {
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

  const [deleteMaterialMutation, deleteMaterialMutationStatus] = useMutation(
    MaterialsContainer.gql.mutations.deleteMaterial
  );

  const [toDelete, setToDelete] = useState<Partial<Material>>();
  const toast = useToast();
  const deleteDialog = useDisclosure({
    isOpen: Boolean(toDelete),
    onClose: () => setToDelete(undefined),
  });

  const getRowColor = useCallback<
    (material: Partial<Material>) => React.ComponentProps<typeof Tr>['bgColor']
  >((material: Partial<Material>) => {
    if (
      !_.isNull(material.currentQuantity) &&
      !_.isUndefined(material.currentQuantity) &&
      material.currentQuantity <= (material.alertQuantity as number)
    ) {
      return 'yellow.100';
    }
  }, []);

  const handleDeleteMaterialClick = useCallback(() => {
    if (toDelete?.id) {
      deleteMaterialMutation({
        variables: { materialId: toDelete.id },
        onCompleted() {
          toast({ description: 'Material eliminado exitosamente.' });
          deleteDialog.onClose();
          materialsQuery.refetch();
        },
      });
    }
  }, [toDelete?.id, deleteMaterialMutation, toast, deleteDialog, materialsQuery]);

  return (
    <>
      <PageHeader title="Materiales" />

      <Button
        as={Link}
        to={appRoutes.materials.create}
        colorScheme="orange"
        leftIcon={<MdAddCircleOutline />}
      >
        Nuevo material
      </Button>

      <MaterialsContainerFilters
        onDebouncedChange={onDebouncedSearchParamsChange}
        onImmediateChange={onImmediateSearchParamsChange}
        onReset={onResetFilters}
        searchParams={searchParams}
      />

      {materialsQuery.loading && (
        <Flex justifyContent="center" my="8">
          <Spinner
            color="orange.500"
            emptyColor="gray.200"
            size="lg"
            speed="0.65s"
            thickness="3px"
          />
        </Flex>
      )}

      {!materialsQuery.loading && (
        <Card mt="8" p="2">
          {materialsQuery.data?.materials.items.length ? (
            <>
              <TableContainer>
                <Box mt="4" mx="4">
                  <Pagination
                    {...materialsQuery.data.materials.paginationInfo}
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
                      <Th w="75%">Nombre</Th>
                      <Th textAlign="center" w="25%">
                        Existencias
                      </Th>
                      <Th w="0" />
                    </Tr>
                  </Thead>

                  <Tbody>
                    {materialsQuery.data.materials.items.map(material => (
                      <Tr key={material.id} bgColor={getRowColor(material)}>
                        <Td textAlign="center">{material.code}</Td>
                        <Td>{material.name}</Td>
                        <Td textAlign="center">
                          {formatMaterialQuantity(material.currentQuantity, material.measureUnit)}
                        </Td>
                        <Td textAlign="center">
                          <IconButton
                            aria-label="edit"
                            colorScheme="blue"
                            rounded="full"
                            icon={<MdEdit />}
                            size="xs"
                            as={Link}
                            to={appRoutes.materials.edit.replace(':materialId', material.id)}
                          />

                          <IconButton
                            aria-label="delete"
                            colorScheme="red"
                            rounded="full"
                            icon={<MdDelete />}
                            size="xs"
                            ml="1"
                            onClick={() => setToDelete(material)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <DeleteDialog
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
              </DeleteDialog>
            </>
          ) : (
            <NoRecordsAlert entity="materiales" />
          )}
        </Card>
      )}
    </>
  );
}
