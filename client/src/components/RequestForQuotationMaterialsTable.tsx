import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { MaterialMeasureUnit } from '../__generated__/graphql';
import { formatCurrency, formatMaterialQuantity } from '../helpers';
import { MdDelete } from 'react-icons/md';
import { useCallback, useMemo } from 'react';

export type RequestForQuotationMaterialsTableRow = {
  code: string;
  measureUnit: MaterialMeasureUnit;
  name: string;
  quantity: number;
  unitPrice?: number;
};

type Props = React.ComponentProps<typeof TableContainer> & {
  materials: RequestForQuotationMaterialsTableRow[];
  onDelete?: (code: string) => void;
};

export default function RequestForQuotationMaterialsTable({
  materials,
  onDelete,
  ...rest
}: Props): JSX.Element | null {
  const hasUnitPriceColumn = useMemo(() => {
    return !onDelete && materials.length && materials[0].unitPrice;
  }, [materials, onDelete]);

  const getSubtotal = useCallback((input: number, qty: number) => {
    return formatCurrency(input * qty);
  }, []);

  const totalAmount = useMemo(() => {
    return materials.reduce((sum, item, index) => {
      sum += (item.unitPrice as number) * item.quantity;

      return sum;
    }, 0);
  }, [materials]);

  if (!materials.length) {
    return null;
  }

  return (
    <TableContainer {...rest}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th w="70%">Material</Th>
            <Th textAlign="center" w="30%">
              Cantidad
            </Th>
            {hasUnitPriceColumn && (
              <>
                <Th w="0" textAlign="center">
                  Precio unitario
                </Th>
                <Th w="0" textAlign="center">
                  Subtotal
                </Th>
              </>
            )}
            {onDelete && <Th w="0" />}
          </Tr>
        </Thead>

        <Tbody>
          {materials.map(material => (
            <Tr key={material.code}>
              <Td>{`[${material.code}] ${material.name}`}</Td>
              <Td textAlign="center">
                {formatMaterialQuantity(material.quantity, material.measureUnit)}
              </Td>

              {hasUnitPriceColumn && (
                <>
                  <Td textAlign="right">{formatCurrency(material.unitPrice as number)}</Td>
                  <Td textAlign="right">
                    {getSubtotal(material.unitPrice as number, material.quantity)}
                  </Td>
                </>
              )}

              {onDelete && (
                <Td>
                  <IconButton
                    aria-label="delete"
                    colorScheme="red"
                    rounded="full"
                    icon={<MdDelete />}
                    size="xs"
                    onClick={() => onDelete(material.code)}
                  />
                </Td>
              )}
            </Tr>
          ))}

          {hasUnitPriceColumn && (
            <>
              <Tr bgColor="gray.700">
                <Td colSpan={4} textAlign="right">
                  <Text
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    color="whiteAlpha.800"
                  >
                    <Text as="span">Total:</Text> {formatCurrency(totalAmount)}
                  </Text>
                </Td>
              </Tr>
            </>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
