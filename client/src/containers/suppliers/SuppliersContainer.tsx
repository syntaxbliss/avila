import {
  Button,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Card, NoRecordsAlert, PageHeader } from '../../components';
import { Link } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdAddCircleOutline, MdOutlineMode } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useSuspenseQuery } from '@apollo/client';
import SuspenseSpinner from '../../components/SuspenseSpinner';

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
};

function SuppliersContent(): JSX.Element {
  const { data } = useSuspenseQuery(SuppliersContent.gql.queries.suppliers, {
    fetchPolicy: 'network-only',
  });

  return (
    <Card mt="8" px="3" py="2">
      {data.suppliers.length > 0 ? (
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
                      icon={<MdOutlineMode />}
                      size="xs"
                      as={Link}
                      to={appRoutes.suppliers.edit.replace(':supplierId', supplier.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <NoRecordsAlert entity="proveedores" />
      )}
    </Card>
  );
}
