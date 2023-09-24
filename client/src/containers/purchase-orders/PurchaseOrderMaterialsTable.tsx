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
import {
  calculatePurchaseOrderMaterialsTotalAmount,
  formatCurrency,
  formatMaterialQuantity,
} from '../../helpers';
import { MaterialMeasureUnit } from '../../__generated__/graphql';
import { useMemo } from 'react';
import { MdDelete } from 'react-icons/md';

export type PurchaseOrderMaterialsTableRow = {
  code: string;
  measureUnit: MaterialMeasureUnit;
  name: string;
  quantity: number;
  unitPrice: number;
};

type Props = React.ComponentProps<typeof TableContainer> & {
  materials: PurchaseOrderMaterialsTableRow[];
  onDelete?: (code: string) => void;
};

export default function PurchaseOrderMaterialsTable({
  materials,
  onDelete,
  ...rest
}: Props): JSX.Element | null {
  const totalAmount = useMemo(() => {
    return calculatePurchaseOrderMaterialsTotalAmount(materials);
  }, [materials]);

  if (!materials.length) {
    return null;
  }

  return (
    <TableContainer {...rest}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th w="40%">Material</Th>
            <Th textAlign="center" w="20%">
              Cantidad
            </Th>
            <Th textAlign="center" w="20%">
              Precio unitario
            </Th>
            <Th textAlign="center" w="20%">
              Subtotal
            </Th>
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
              <Td textAlign="right">{formatCurrency(material.unitPrice)}</Td>
              <Td textAlign="right">{formatCurrency(material.unitPrice * material.quantity)}</Td>

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
            {onDelete && <Td />}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
