import {
  Button,
  Divider,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  Card,
  DeleteDialog,
  FormInputText,
  FormSelect,
  FormSwitch,
  NoRecordsAlert,
  PageHeader,
  Pagination,
  SuspenseSpinner,
} from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdDelete, MdEdit, MdFilterAltOff } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { formatMaterialQuantity } from '../../helpers';
import { useCallback, useRef, useState } from 'react';
import {
  Material,
  PaginationInput,
  QuerySortOrder,
  SearchMaterialQuerySortField,
} from '../../__generated__/graphql';
import _ from 'lodash';
import { useFilters } from '../../hooks';

type SearchParams = {
  code: string;
  name: string;
  lowQuantity: boolean;
  sortField: SearchMaterialQuerySortField;
  sortOrder: QuerySortOrder;
};

const sortFieldSelectOptions = [
  { label: 'Nombre', value: SearchMaterialQuerySortField.Name },
  { label: 'Código', value: SearchMaterialQuerySortField.Code },
];

const sortOrderSelectOptions = [
  { label: 'Ascendente', value: QuerySortOrder.Asc },
  { label: 'Descendente', value: QuerySortOrder.Desc },
];

const defaultFilters: SearchParams = {
  code: '',
  name: '',
  lowQuantity: false,
  sortField: SearchMaterialQuerySortField.Name,
  sortOrder: QuerySortOrder.Asc,
};

export default function MaterialsContainer(): JSX.Element {
  const [form, setForm] = useState<SearchParams>({ ...defaultFilters });
  const searchParams = useFilters(defaultFilters, form);

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

      <Card mt="8" title="Filtros">
        <Grid templateColumns="1fr auto 1fr auto auto" gap="5">
          <GridItem>
            <Grid templateColumns="1fr 1fr" gap="5">
              <FormInputText
                label="Código"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />

              <FormInputText
                label="Nombre"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />

              <FormSwitch
                gridColumn="1 / 3"
                label="Sólo materiales con bajas existencias"
                id="materials-container__low-quantity"
                value={form.lowQuantity}
                onChange={e => setForm({ ...form, lowQuantity: e })}
              />
            </Grid>
          </GridItem>

          <GridItem>
            <Divider orientation="vertical" />
          </GridItem>

          <GridItem>
            <Grid templateColumns="1fr 1fr" gap="5">
              <FormSelect
                label="Ordenar por"
                options={sortFieldSelectOptions}
                value={form.sortField}
                onChange={e =>
                  setForm({ ...form, sortField: e.target.value as SearchMaterialQuerySortField })
                }
                placeholder=""
              />

              <FormSelect
                label="Sentido"
                options={sortOrderSelectOptions}
                value={form.sortOrder}
                onChange={e => setForm({ ...form, sortOrder: e.target.value as QuerySortOrder })}
                placeholder=""
              />
            </Grid>
          </GridItem>

          <GridItem>
            <Divider orientation="vertical" />
          </GridItem>

          <GridItem>
            <IconButton
              mt="6"
              rounded="full"
              aria-label="clear-filters"
              icon={<MdFilterAltOff />}
              colorScheme="orange"
              onClick={() => setForm(defaultFilters)}
              isDisabled={_.isEqual(defaultFilters, form)}
            />
          </GridItem>
        </Grid>
      </Card>

      <SuspenseSpinner>
        <MaterialsContent searchParams={searchParams} />
      </SuspenseSpinner>
    </>
  );
}

MaterialsContent.gql = {
  queries: {
    materials: gql(`
      query MaterialsContentMaterialsQuery ($searchParams: SearchMaterialInput, $pagination: PaginationInput) {
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
      mutation MaterialsContentDeleteMaterialMutation ($materialId: ID!) {
        deleteMaterial (materialId: $materialId)
      }
    `),
  },
};

type MaterialsContentProps = {
  searchParams: SearchParams;
};

function MaterialsContent({ searchParams }: MaterialsContentProps): JSX.Element {
  const pagination = useRef<PaginationInput>({ pageNumber: 1, pageSize: 10 });

  const { data, refetch } = useSuspenseQuery(MaterialsContent.gql.queries.materials, {
    fetchPolicy: 'network-only',
    variables: { searchParams, pagination: pagination.current },
  });

  const [deleteMaterialMutation, deleteMaterialMutationStatus] = useMutation(
    MaterialsContent.gql.mutations.deleteMaterial
  );

  const refetchWithPersistedVariables = useCallback(() => {
    refetch({ searchParams, pagination: pagination.current });
  }, [refetch, searchParams]);

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
          refetchWithPersistedVariables();
        },
      });
    }
  }, [toDelete?.id, deleteMaterialMutation, toast, deleteDialog, refetchWithPersistedVariables]);

  return (
    <Card mt="8" px="3" py="2">
      {data.materials.items.length > 0 ? (
        <>
          <TableContainer>
            <Pagination
              {...data.materials.paginationInfo}
              onPageNumberChange={pageNumber => {
                pagination.current = { ...pagination.current, pageNumber };
                refetchWithPersistedVariables();
              }}
            />

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
                {data.materials.items.map(material => (
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
  );
}
