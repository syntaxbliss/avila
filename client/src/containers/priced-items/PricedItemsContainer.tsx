import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../__generated__';
import {
  Card,
  FormInputNumber,
  LoadingSpinner,
  NoRecordsAlert,
  PageHeader,
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
import _ from 'lodash';
import { Material, Part, PricedItem } from '../../__generated__/graphql';
import { formatCurrency, formatMaterialQuantity, measureUnitAbbreviationText } from '../../helpers';
import { MdCheck } from 'react-icons/md';
import { validationRules } from '../../validation/rules';

PricedItemsContainer.gql = {
  queries: {
    pricedItems: gql(`
      query PricedItemsContainerPricedItemsQuery {
        pricedItems {
          id
          unitPrice
          element {
            ... on Material {
              id
              code
              name
              measureUnit
            }
            ... on Part {
              id
              code
              name
              materials {
                id
                quantity
                material {
                  id
                  name
                  code
                  measureUnit
                }
              }
            }
          }
        }
      }
    `),
  },

  mutations: {
    updatePricedItem: gql(`
      mutation PricedItemsContainerUpdatePricedItemMutation ($pricedItemId: ID!, $unitPrice: Float!) {
        updatePricedItem (pricedItemId: $pricedItemId, unitPrice: $unitPrice) {
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

export default function PricedItemsContainer(): JSX.Element {
  const pricedItemsQuery = useQuery(PricedItemsContainer.gql.queries.pricedItems, {
    fetchPolicy: 'network-only',
  });

  const idsOfPricedItemBeingUpdated = useRef(new Set());

  const [updatePricedItemMutation, updatePricedItemMutationStatus] = useMutation(
    PricedItemsContainer.gql.mutations.updatePricedItem
  );

  const [pricedMaterials, pricedParts] = useMemo(() => {
    return _.partition(pricedItemsQuery.data?.pricedItems, item => 'measureUnit' in item.element);
  }, [pricedItemsQuery.data?.pricedItems]);

  const getMaterialUnitPrice = useCallback(
    (materialId: string) => {
      if (!pricedItemsQuery.data?.pricedItems) {
        return null;
      }

      const pricedMaterial = pricedItemsQuery.data.pricedItems.find(pi => {
        return pi.element.id === materialId;
      });

      if (!pricedMaterial) {
        throw new Error();
      }

      return pricedMaterial.unitPrice ?? null;
    },
    [pricedItemsQuery.data?.pricedItems]
  );

  const calculatePartTotalPrice = useCallback(
    (part: Part) => {
      const allMaterialsArePriced = part.materials.every(
        pm => getMaterialUnitPrice(pm.material.id) !== null
      );

      if (allMaterialsArePriced) {
        return part.materials.reduce((sum, partMaterial) => {
          const quantity = partMaterial.quantity;
          const materialUnitPrice = getMaterialUnitPrice(partMaterial.material.id) || 0;

          sum += quantity * materialUnitPrice;

          return sum;
        }, 0);
      }

      return null;
    },
    [getMaterialUnitPrice]
  );

  const handleUpdateUnitPrice = useCallback(
    async (pricedItemId: string, unitPrice: number) => {
      try {
        idsOfPricedItemBeingUpdated.current.add(pricedItemId);

        await updatePricedItemMutation({
          variables: { pricedItemId, unitPrice },
        });
      } catch {
        throw new Error();
      } finally {
        idsOfPricedItemBeingUpdated.current.delete(pricedItemId);
      }
    },
    [updatePricedItemMutation]
  );

  return (
    <>
      <PageHeader title="Lista de precios" />

      <LoadingSpinner isVisible={pricedItemsQuery.loading} />

      {!pricedItemsQuery.loading && (
        <>
          <Card title="Materiales" mt="8">
            {pricedMaterials.length ? (
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
                    {pricedMaterials.map(pricedMaterial => (
                      <MaterialRow
                        key={pricedMaterial.id}
                        onUpdateClick={handleUpdateUnitPrice}
                        pricedMaterial={pricedMaterial as PricedItem}
                        unitPrice={pricedMaterial.unitPrice ?? undefined}
                        isLoading={
                          idsOfPricedItemBeingUpdated.current.has(pricedMaterial.id) &&
                          updatePricedItemMutationStatus.loading
                        }
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoRecordsAlert entity="precios" />
            )}
          </Card>

          <Card title="Partes" mt="8">
            {pricedParts.length ? (
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
                    {pricedParts.map(pricedPart => {
                      const part = pricedPart.element as Part;
                      const [firstPartMaterial, ...remainingPartMaterials] = part.materials;
                      const firstPartMaterialPrice = getMaterialUnitPrice(
                        firstPartMaterial.material.id
                      );
                      const partTotalPrice = calculatePartTotalPrice(part);
                      const firstPartCellsBgColor = firstPartMaterialPrice ? undefined : 'red.100';

                      return (
                        <Fragment key={pricedPart.id}>
                          <Tr>
                            <Td rowSpan={part.materials.length} textAlign="center">
                              {part.code}
                            </Td>
                            <Td rowSpan={part.materials.length}>{part.name}</Td>
                            <Td bgColor={firstPartCellsBgColor} borderLeftWidth="1px">
                              <Link
                                href={`#${firstPartMaterial.material.id}`}
                              >{`[${firstPartMaterial.material.code}] ${firstPartMaterial.material.name}`}</Link>
                            </Td>
                            <Td bgColor={firstPartCellsBgColor} textAlign="center">
                              {formatMaterialQuantity(
                                firstPartMaterial.quantity,
                                firstPartMaterial.material.measureUnit
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

                          {remainingPartMaterials.map(pem => {
                            const partMaterialPrice = getMaterialUnitPrice(pem.material.id);
                            const cellsBgColor = partMaterialPrice ? undefined : 'red.100';

                            return (
                              <Tr key={`${part.id}-${pem.id}`}>
                                <Td bgColor={cellsBgColor} borderLeftWidth="1px">
                                  <Link
                                    href={`#${pem.material.id}`}
                                  >{`[${pem.material.code}] ${pem.material.name}`}</Link>
                                </Td>
                                <Td bgColor={cellsBgColor} textAlign="center">
                                  {formatMaterialQuantity(pem.quantity, pem.material.measureUnit)}
                                </Td>
                                <Td bgColor={cellsBgColor} textAlign="right">
                                  {partMaterialPrice && formatCurrency(partMaterialPrice)}
                                </Td>
                                <Td bgColor={cellsBgColor} textAlign="right">
                                  {partMaterialPrice &&
                                    formatCurrency(partMaterialPrice * pem.quantity)}
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
              <NoRecordsAlert entity="precios" />
            )}
          </Card>
        </>
      )}
    </>
  );
}

type MaterialRowProps = {
  isLoading: boolean;
  onUpdateClick: (pricedItemId: string, unitPrice: number) => void;
  pricedMaterial: PricedItem;
  unitPrice?: number;
};

const MaterialRow = memo(function MaterialRow({
  isLoading,
  onUpdateClick,
  pricedMaterial,
  unitPrice,
}: MaterialRowProps): JSX.Element {
  const material = pricedMaterial.element as Material;

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
    <Tr id={pricedMaterial.element.id}>
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
              onUpdateClick(pricedMaterial.id, parsedData.data as number);
            }
          }}
          isDisabled={shouldDisableSaveButton}
        />
      </Td>
    </Tr>
  );
});
