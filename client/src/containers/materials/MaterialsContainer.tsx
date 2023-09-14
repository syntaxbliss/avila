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
import { formatMaterialQuantity } from '../../helpers';
import { useCallback } from 'react';
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
};

function MaterialsContent(): JSX.Element {
  const { data } = useSuspenseQuery(MaterialsContent.gql.queries.materials, {
    fetchPolicy: 'network-only',
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

  return (
    <Card mt="8" px="3" py="2">
      {data.materials.length > 0 ? (
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
                      icon={<MdOutlineMode />}
                      size="xs"
                      as={Link}
                      to={appRoutes.materials.edit.replace(':materialId', material.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <NoRecordsAlert entity="materiales" />
      )}
    </Card>
  );
}
