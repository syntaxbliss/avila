import { IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { MaterialMeasureUnit } from '../__generated__/graphql';
import { formatMaterialQuantity } from '../helpers';
import { MdDelete } from 'react-icons/md';

export type RequestForQuotationMaterialsTableRow = {
  code: string;
  measureUnit: MaterialMeasureUnit;
  name: string;
  quantity: number;
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
        </Tbody>
      </Table>
    </TableContainer>
  );
}
