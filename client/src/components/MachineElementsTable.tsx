import {
  IconButton,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { MachineElementElementType, MeasureUnit } from '../__generated__/graphql';
import { formatMaterialQuantity } from '../helpers';
import { MdDelete, MdOutlineHandyman, MdShelves } from 'react-icons/md';

export type MachineElementsTableRow = {
  code: string;
  elementId: string;
  elementType: MachineElementElementType;
  measureUnit?: MeasureUnit;
  name: string;
  quantity: number;
};

type Props = React.ComponentProps<typeof TableContainer> & {
  elements: MachineElementsTableRow[];
  onDelete?: (elementId: string) => void;
};

export default function MachineElementsTable({
  elements,
  onDelete,
  ...rest
}: Props): JSX.Element | null {
  if (!elements.length) {
    return null;
  }

  return (
    <TableContainer {...rest}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th textAlign="center" w="0">
              Tipo
            </Th>
            <Th w="70%">Componente</Th>
            <Th textAlign="center" w="30%">
              Cantidad
            </Th>

            {onDelete && <Th w="0" />}
          </Tr>
        </Thead>

        <Tbody>
          {elements.map(element => (
            <Tr key={element.elementId}>
              <Td textAlign="center">
                {element.elementType === MachineElementElementType.Material ? (
                  <Tag size="sm" colorScheme="blue">
                    <TagLeftIcon as={MdShelves} />
                    <TagLabel textTransform="uppercase" fontWeight="bold" letterSpacing="wider">
                      Material
                    </TagLabel>
                  </Tag>
                ) : (
                  <Tag size="sm" colorScheme="red">
                    <TagLeftIcon as={MdOutlineHandyman} />
                    <TagLabel textTransform="uppercase" fontWeight="bold" letterSpacing="wider">
                      Parte
                    </TagLabel>
                  </Tag>
                )}
              </Td>
              <Td>{`[${element.code}] ${element.name}`}</Td>
              <Td textAlign="center">
                {formatMaterialQuantity(element.quantity, element.measureUnit ?? MeasureUnit.Unit)}
              </Td>

              {onDelete && (
                <Td>
                  <IconButton
                    aria-label="delete"
                    colorScheme="red"
                    rounded="full"
                    icon={<MdDelete />}
                    size="xs"
                    onClick={() => onDelete(element.elementId)}
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
