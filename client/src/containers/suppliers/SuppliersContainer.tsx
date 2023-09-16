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
import { useCallback, useState } from 'react';
import { Supplier } from '../../__generated__/graphql';

export default function SuppliersContainer(): JSX.Element {
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

      <SuspenseSpinner>
        <SuppliersContent />
      </SuspenseSpinner>
    </>
  );
}

SuppliersContent.gql = {
  queries: {
    suppliers: gql(`
      query SuppliersContentSuppliersQuery {
        suppliers {
          id
          name
          address
          email
          phone
        }
      }
    `),
  },
  mutations: {
    deleteSupplier: gql(`
      mutation SuppliersContentDeleteSupplierMutation ($supplierId: ID!) {
        deleteSupplier (supplierId: $supplierId)
      }
    `),
  },
};

function SuppliersContent(): JSX.Element {
  const { data, refetch } = useSuspenseQuery(SuppliersContent.gql.queries.suppliers, {
    fetchPolicy: 'network-only',
  });

  const [deleteSupplierMutation, deleteSupplierMutationStatus] = useMutation(
    SuppliersContent.gql.mutations.deleteSupplier
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
          refetch();
        },
      });
    }
  }, [toDelete?.id, deleteSupplierMutation, toast, deleteDialog, refetch]);

  return (
    <Card mt="8" px="3" py="2">
      {data.suppliers.length > 0 ? (
        <>
          <TableContainer>
            <Table size="sm" variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th w="0" />
                </Tr>
              </Thead>

              <Tbody>
                {data.suppliers.map(supplier => (
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

          <DeleteDialog
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
          </DeleteDialog>
        </>
      ) : (
        <NoRecordsAlert entity="proveedores" />
      )}
    </Card>
  );
}
