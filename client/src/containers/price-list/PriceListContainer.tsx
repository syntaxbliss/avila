import { useMutation, useSuspenseQuery } from '@apollo/client';
import { gql } from '../../__generated__';
import {
  Card,
  FormInputNumber,
  NoRecordsAlert,
  PageHeader,
  SuspenseSpinner,
} from '../../components';
import {
  Flex,
  IconButton,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Material } from '../../__generated__/graphql';
import { formatCurrency, formatMaterialQuantity, measureUnitAbbreviationText } from '../../helpers';
import { MdCheck } from 'react-icons/md';
import { validationRules } from '../../validation/rules';

export default function PriceListContainer(): JSX.Element {
  return (
    <>
      <PageHeader title="Lista de precios" />

      <SuspenseSpinner>
        <PriceListContent />
      </SuspenseSpinner>
    </>
  );
}

PriceListContent.gql = {
  queries: {
    materials: gql(`
      query PriceListContentMaterialsQuery {
        materials {
          items {
            id
            code
            name
            measureUnit
            unitPrice
          }
        }
      }
    `),

    parts: gql(`
      query PriceListContentPartsQuery {
        parts {
          items {
            id
            code
            name
            materials {
              quantity
              material {
                id
              }
            }
          }
        }
      }
    `),
  },

  mutations: {
    updateMaterialUnitPrice: gql(`
      mutation PriceListContentUpdateMaterialUnitPriceMutation ($materialId: ID!, $unitPrice: Float!) {
        updateMaterialUnitPrice (materialId: $materialId, unitPrice: $unitPrice) {
          id
          unitPrice
        }
      }
    `),
  },
};

const parseUnitPrice = (unitPrice: string) => {
  return validationRules.decimal(0.01, 99999999.99, true).safeParse(unitPrice);
};

function PriceListContent(): JSX.Element {
  const materialsQuery = useSuspenseQuery(PriceListContent.gql.queries.materials, {
    fetchPolicy: 'network-only',
  });

  const partsQuery = useSuspenseQuery(PriceListContent.gql.queries.parts, {
    fetchPolicy: 'network-only',
  });

  const idsOfMaterialsBeingUpdated = useRef(new Set());

  const [updateMaterialUnitPrice, updateMaterialUnitPriceStatus] = useMutation(
    PriceListContent.gql.mutations.updateMaterialUnitPrice
  );

  const materialsByMaterialId = useMemo(() => {
    return materialsQuery.data.materials.items.reduce((obj, material) => {
      obj[material.id] = material;

      return obj;
    }, {} as Record<string, (typeof materialsQuery.data.materials.items)[number]>);
  }, [materialsQuery]);

  const calculatePartTotalPrice = useCallback(
    (part: (typeof partsQuery.data.parts.items)[number]) => {
      const allMaterialsArePriced = part.materials.every(pm =>
        Boolean(materialsByMaterialId[pm.material.id].unitPrice)
      );

      if (allMaterialsArePriced) {
        return part.materials.reduce((sum, pm) => {
          const quantity = pm.quantity;
          const materialUnitPrice = materialsByMaterialId[pm.material.id].unitPrice as number;

          sum += quantity * materialUnitPrice;

          return sum;
        }, 0);
      }

      return null;
    },
    [materialsByMaterialId, partsQuery]
  );

  const handleUpdateUnitPrice = useCallback(
    async (materialId: string, unitPrice: number) => {
      try {
        idsOfMaterialsBeingUpdated.current.add(materialId);

        await updateMaterialUnitPrice({ variables: { materialId, unitPrice } });
      } catch {
        throw new Error();
      } finally {
        idsOfMaterialsBeingUpdated.current.delete(materialId);
      }
    },
    [updateMaterialUnitPrice]
  );

  return (
    <>
      <Card title="Materiales" mt="8">
        {materialsQuery.data.materials.items.length ? (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th textAlign="center" w="0">
                    Código
                  </Th>
                  <Th w="calc(100% - 250px)">Nombre</Th>
                  <Th textAlign="center" w="250px">
                    Precio unitario
                  </Th>
                  <Th w="0" />
                </Tr>
              </Thead>

              <Tbody>
                {materialsQuery.data.materials.items.map(material => (
                  <MaterialRow
                    key={material.id}
                    onUpdateClick={handleUpdateUnitPrice}
                    material={material as Material}
                    unitPrice={material.unitPrice ?? undefined}
                    isLoading={
                      idsOfMaterialsBeingUpdated.current.has(material.id) &&
                      updateMaterialUnitPriceStatus.loading
                    }
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <NoRecordsAlert entity="materiales" />
        )}
      </Card>

      <Card title="Partes" mt="8">
        {partsQuery.data.parts.items.length ? (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th textAlign="center" w="0">
                    Código
                  </Th>
                  <Th w="20%">Nombre</Th>
                  <Th w="25%">Material</Th>
                  <Th w="25%" textAlign="center">
                    Cantidad
                  </Th>
                  <Th w="15%" textAlign="center">
                    Precio unitario
                  </Th>
                  <Th w="15%" textAlign="center">
                    Subtotal
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {partsQuery.data.parts.items.map(part => {
                  const [firstPartMaterial, ...remainingPartMaterials] = part.materials;
                  const firstMaterial = materialsByMaterialId[firstPartMaterial.material.id];
                  const firstPartMaterialPrice = firstMaterial.unitPrice;
                  const partTotalPrice = calculatePartTotalPrice(part);
                  const firstPartCellsBgColor = firstPartMaterialPrice ? undefined : 'red.100';

                  return (
                    <Fragment key={part.id}>
                      <Tr>
                        <Td rowSpan={part.materials.length} textAlign="center">
                          {part.code}
                        </Td>
                        <Td rowSpan={part.materials.length}>{part.name}</Td>
                        <Td bgColor={firstPartCellsBgColor} borderLeftWidth="1px">
                          <Link
                            href={`#${firstMaterial.id}`}
                          >{`[${firstMaterial.code}] ${firstMaterial.name}`}</Link>
                        </Td>
                        <Td bgColor={firstPartCellsBgColor} textAlign="center">
                          {formatMaterialQuantity(
                            firstPartMaterial.quantity,
                            firstMaterial.measureUnit
                          )}
                        </Td>
                        <Td bgColor={firstPartCellsBgColor} textAlign="right">
                          {firstPartMaterialPrice && formatCurrency(firstPartMaterialPrice)}
                        </Td>
                        <Td bgColor={firstPartCellsBgColor} textAlign="right">
                          {firstPartMaterialPrice &&
                            formatCurrency(firstPartMaterialPrice * firstPartMaterial.quantity)}
                        </Td>
                      </Tr>

                      {remainingPartMaterials.map(pm => {
                        const material = materialsByMaterialId[pm.material.id];
                        const cellsBgColor = material.unitPrice ? undefined : 'red.100';

                        return (
                          <Tr key={`${part.id}-${material.id}`}>
                            <Td bgColor={cellsBgColor} borderLeftWidth="1px">
                              <Link
                                href={`#${material.id}`}
                              >{`[${material.code}] ${material.name}`}</Link>
                            </Td>
                            <Td bgColor={cellsBgColor} textAlign="center">
                              {formatMaterialQuantity(pm.quantity, material.measureUnit)}
                            </Td>
                            <Td bgColor={cellsBgColor} textAlign="right">
                              {material.unitPrice && formatCurrency(material.unitPrice)}
                            </Td>
                            <Td bgColor={cellsBgColor} textAlign="right">
                              {material.unitPrice &&
                                formatCurrency(material.unitPrice * pm.quantity)}
                            </Td>
                          </Tr>
                        );
                      })}

                      <Tr bgColor="gray.700">
                        <Td colSpan={6} textAlign="right">
                          <Text
                            fontWeight="bold"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            color="whiteAlpha.800"
                          >
                            <Text as="span">Total:</Text>{' '}
                            {partTotalPrice ? formatCurrency(partTotalPrice) : '-'}
                          </Text>
                        </Td>
                      </Tr>
                    </Fragment>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <NoRecordsAlert entity="partes" />
        )}
      </Card>
    </>
  );
}

type MaterialRowProps = {
  isLoading: boolean;
  material: Material;
  onUpdateClick: (materialId: string, unitPrice: number) => void;
  unitPrice?: number;
};

const MaterialRow = memo(function MaterialRow({
  isLoading,
  material,
  onUpdateClick,
  unitPrice,
}: MaterialRowProps): JSX.Element {
  const [price, setPrice] = useState('');

  const parsedData = useMemo(() => parseUnitPrice(price), [price]);

  const shouldDisableSaveButton = useMemo(() => {
    if (!parsedData.success) {
      return true;
    }

    return parsedData.data === unitPrice;
  }, [parsedData, unitPrice]);

  useEffect(() => {
    setPrice(unitPrice ? unitPrice.toFixed(2) : '');
  }, [unitPrice]);

  return (
    <Tr id={material.id}>
      <Td textAlign="center">{material.code}</Td>
      <Td>{material.name}</Td>
      <Td textAlign="center">
        <Flex alignItems="center">
          <Text flex={0} minW="20px">
            $
          </Text>

          <FormInputNumber min={0.01} onChange={e => setPrice(e)} value={price} />

          <Text flex={0} minW="25px" textAlign="right">
            {measureUnitAbbreviationText[material.measureUnit]}
          </Text>
        </Flex>
      </Td>
      <Td>
        <IconButton
          aria-label="save"
          colorScheme="green"
          rounded="full"
          icon={<MdCheck />}
          size="xs"
          isLoading={isLoading}
          onClick={() => {
            if (parsedData.success) {
              onUpdateClick(material.id, parsedData.data as number);
            }
          }}
          isDisabled={shouldDisableSaveButton}
        />
      </Td>
    </Tr>
  );
});
