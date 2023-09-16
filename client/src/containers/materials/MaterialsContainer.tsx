import {
  Button,
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
import { Card, DeleteDialog, NoRecordsAlert, PageHeader, SuspenseSpinner } from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdDelete, MdEdit } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { formatMaterialQuantity } from '../../helpers';
import { useCallback, useState } from 'react';
import { Material } from '../../__generated__/graphql';
import _ from 'lodash';

export default function MaterialsContainer(): JSX.Element {
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

      <SuspenseSpinner>
        <MaterialsContent />
      </SuspenseSpinner>
    </>
  );
}

MaterialsContent.gql = {
  queries: {
    materials: gql(`
      query MaterialsContentMaterialsQuery {
        materials {
          id
          name
          code
          measureUnit
          currentQuantity
          alertQuantity
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

function MaterialsContent(): JSX.Element {
  const { data, refetch } = useSuspenseQuery(MaterialsContent.gql.queries.materials, {
    fetchPolicy: 'network-only',
  });

  const [deleteMaterialMutation, deleteMaterialMutationStatus] = useMutation(
    MaterialsContent.gql.mutations.deleteMaterial
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
          refetch();
        },
      });
    }
  }, [toDelete?.id, deleteMaterialMutation, toast, deleteDialog, refetch]);

  return (
    <Card mt="8" px="3" py="2">
      {data.materials.length > 0 ? (
        <>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th textAlign="center" w="0">
                    Código
                  </Th>
                  <Th w="50%">Nombre</Th>
                  <Th textAlign="center" w="25%">
                    Cantidad en stock
                  </Th>
                  <Th textAlign="center" w="25%">
                    Cantidad de alerta
                  </Th>
                  <Th w="0" />
                </Tr>
              </Thead>

              <Tbody>
                {data.materials.map(material => (
                  <Tr key={material.id} bgColor={getRowColor(material)}>
                    <Td textAlign="center">{material.code}</Td>
                    <Td>{material.name}</Td>
                    <Td textAlign="center">
                      {formatMaterialQuantity(material.currentQuantity, material.measureUnit)}
                    </Td>
                    <Td textAlign="center">
                      {formatMaterialQuantity(material.alertQuantity, material.measureUnit)}
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
