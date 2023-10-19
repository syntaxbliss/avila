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
  Icon,
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
import {
  Material,
  MeasureUnit,
  Part,
  PriceListContentMachinesQueryQuery,
  PriceListContentMaterialsQueryQuery,
  PriceListContentPartsQueryQuery,
} from '../../__generated__/graphql';
import { formatCurrency, formatMaterialQuantity, measureUnitAbbreviationText } from '../../helpers';
import { MdCheck, MdOutlineHandyman, MdShelves } from 'react-icons/md';
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

    machines: gql(`
      query PriceListContentMachinesQuery {
        machines {
          items {
            id
            code
            name
            elements {
              quantity
              element {
                ... on Material {
                  id
                }
                ... on Part {
                  id
                }
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

  const machinesQuery = useSuspenseQuery(PriceListContent.gql.queries.machines, {
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
    }, {} as Record<string, PriceListContentMaterialsQueryQuery['materials']['items'][number]>);
  }, [materialsQuery]);

  const calculatePartTotalPrice = useCallback(
    (part: PriceListContentPartsQueryQuery['parts']['items'][number]) => {
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
    [materialsByMaterialId]
  );

  const partsByPartId = useMemo(() => {
    return partsQuery.data.parts.items.reduce((obj, part) => {
      obj[part.id] = { ...part, unitPrice: calculatePartTotalPrice(part) };

      return obj;
    }, {} as Record<string, PriceListContentPartsQueryQuery['parts']['items'][number] & { unitPrice: number | null }>);
  }, [partsQuery, calculatePartTotalPrice]);

  const calculateMachineTotalPrice = useCallback(
    (machine: PriceListContentMachinesQueryQuery['machines']['items'][number]) => {
      const allElementsArePriced = machine.elements.every(me => {
        return Boolean(
          materialsByMaterialId[me.element.id]?.unitPrice ?? partsByPartId[me.element.id]?.unitPrice
        );
      });

      if (allElementsArePriced) {
        return machine.elements.reduce((sum, me) => {
          const quantity = me.quantity;
          const elementUnitPrice = (materialsByMaterialId[me.element.id]?.unitPrice ??
            partsByPartId[me.element.id]?.unitPrice) as number;

          sum += quantity * elementUnitPrice;

          return sum;
        }, 0);
      }

      return null;
    },
    [materialsByMaterialId, partsByPartId]
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
                {partsQuery.data.parts.items.map(part => (
                  <PartRow
                    key={part.id}
                    part={part as Part}
                    materialsByMaterialId={materialsByMaterialId}
                    partsByPartId={partsByPartId}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <NoRecordsAlert entity="partes" />
        )}
      </Card>

      <Card title="Máquinas" mt="8">
        {machinesQuery.data.machines.items.length ? (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th textAlign="center" w="0">
                    Código
                  </Th>
                  <Th w="20%">Nombre</Th>
                  <Th w="25%">Componente</Th>
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
                {machinesQuery.data.machines.items.map(machine => (
                  <MachineRow
                    key={machine.id}
                    machine={machine}
                    materialsByMaterialId={materialsByMaterialId}
                    partsByPartId={partsByPartId}
                    unitPrice={calculateMachineTotalPrice(machine) ?? undefined}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <NoRecordsAlert entity="máquinas" />
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

type PartRowProps = {
  materialsByMaterialId: Record<
    string,
    PriceListContentMaterialsQueryQuery['materials']['items'][number]
  >;
  part: Part;
  partsByPartId: Record<
    string,
    PriceListContentPartsQueryQuery['parts']['items'][number] & { unitPrice: number | null }
  >;
};

function PartRow({ materialsByMaterialId, part, partsByPartId }: PartRowProps): JSX.Element {
  const [firstPartMaterial, ...remainingPartMaterials] = part.materials;
  const firstMaterial = materialsByMaterialId[firstPartMaterial.material.id];
  const firstPartMaterialPrice = firstMaterial.unitPrice;
  const firstPartCellsBgColor = firstPartMaterialPrice ? undefined : 'red.100';

  return (
    <>
      <Tr id={part.id}>
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
          {formatMaterialQuantity(firstPartMaterial.quantity, firstMaterial.measureUnit)}
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
              <Link href={`#${material.id}`}>{`[${material.code}] ${material.name}`}</Link>
            </Td>
            <Td bgColor={cellsBgColor} textAlign="center">
              {formatMaterialQuantity(pm.quantity, material.measureUnit)}
            </Td>
            <Td bgColor={cellsBgColor} textAlign="right">
              {material.unitPrice && formatCurrency(material.unitPrice)}
            </Td>
            <Td bgColor={cellsBgColor} textAlign="right">
              {material.unitPrice && formatCurrency(material.unitPrice * pm.quantity)}
            </Td>
          </Tr>
        );
      })}

      <TotalPriceRow price={partsByPartId[part.id].unitPrice ?? undefined} />
    </>
  );
}

type MachineRowProps = {
  machine: PriceListContentMachinesQueryQuery['machines']['items'][number];
  materialsByMaterialId: Record<
    string,
    PriceListContentMaterialsQueryQuery['materials']['items'][number]
  >;
  partsByPartId: Record<
    string,
    PriceListContentPartsQueryQuery['parts']['items'][number] & { unitPrice: number | null }
  >;
  unitPrice?: number;
};

function MachineRow({
  machine,
  materialsByMaterialId,
  partsByPartId,
  unitPrice,
}: MachineRowProps): JSX.Element {
  const [firstMachineElement, ...remainingMachineElements] = machine.elements;
  const firstElement =
    materialsByMaterialId[firstMachineElement.element.id] ||
    partsByPartId[firstMachineElement.element.id];
  const firstMachineElementPrice = firstElement.unitPrice;
  const firstMachineCellsBgColor = firstMachineElementPrice ? undefined : 'red.100';

  return (
    <>
      <Tr>
        <Td rowSpan={machine.elements.length} textAlign="center">
          {machine.code}
        </Td>
        <Td rowSpan={machine.elements.length}>{machine.name}</Td>
        <Td bgColor={firstMachineCellsBgColor} borderLeftWidth="1px">
          <Flex alignSelf="center">
            {'measureUnit' in firstElement ? (
              <Icon as={MdShelves} color="blue.500" />
            ) : (
              <Icon as={MdOutlineHandyman} color="red.500" />
            )}

            <Link
              ml="4"
              href={`#${firstElement.id}`}
            >{`[${firstElement.code}] ${firstElement.name}`}</Link>
          </Flex>
        </Td>
        <Td bgColor={firstMachineCellsBgColor} textAlign="center">
          {formatMaterialQuantity(
            firstMachineElement.quantity,
            firstElement.measureUnit ?? MeasureUnit.Unit
          )}
        </Td>
        <Td bgColor={firstMachineCellsBgColor} textAlign="right">
          {firstMachineElementPrice && formatCurrency(firstMachineElementPrice)}
        </Td>
        <Td bgColor={firstMachineCellsBgColor} textAlign="right">
          {firstMachineElementPrice &&
            formatCurrency(firstMachineElementPrice * firstMachineElement.quantity)}
        </Td>
      </Tr>

      {remainingMachineElements.map(me => {
        const element = materialsByMaterialId[me.element.id] || partsByPartId[me.element.id];
        const cellsBgColor = element.unitPrice ? undefined : 'red.100';

        return (
          <Tr key={`${machine.id}-${element.id}`}>
            <Td bgColor={cellsBgColor} borderLeftWidth="1px">
              <Flex alignSelf="center">
                {'measureUnit' in element ? (
                  <Icon as={MdShelves} color="blue.500" />
                ) : (
                  <Icon as={MdOutlineHandyman} color="red.500" />
                )}

                <Link ml="4" href={`#${element.id}`}>{`[${element.code}] ${element.name}`}</Link>
              </Flex>
            </Td>
            <Td bgColor={cellsBgColor} textAlign="center">
              {formatMaterialQuantity(me.quantity, element.measureUnit ?? MeasureUnit.Unit)}
            </Td>
            <Td bgColor={cellsBgColor} textAlign="right">
              {element.unitPrice && formatCurrency(element.unitPrice)}
            </Td>
            <Td bgColor={cellsBgColor} textAlign="right">
              {element.unitPrice && formatCurrency(element.unitPrice * me.quantity)}
            </Td>
          </Tr>
        );
      })}

      <TotalPriceRow price={unitPrice} />
    </>
  );
}

type TotalPriceRowProps = {
  price?: number;
};

function TotalPriceRow({ price }: TotalPriceRowProps): JSX.Element {
  return (
    <Tr bgColor={price ? 'gray.700' : 'red.300'}>
      <Td colSpan={6} textAlign="right">
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wide"
          color="whiteAlpha.800"
        >
          <Text as="span">Total:</Text> {price ? formatCurrency(price) : '-'}
        </Text>
      </Td>
    </Tr>
  );
}
