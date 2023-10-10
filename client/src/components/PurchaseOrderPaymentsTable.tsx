import {
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
  calculatePurchaseOrderPaymentsTotalPaid,
  formatCurrency,
  humanReadableDate,
  paymentMethodText,
} from '../helpers';
import { useCallback, useMemo } from 'react';
import { MdDelete, MdStickyNote2 } from 'react-icons/md';
import { PaymentMethod } from '../__generated__/graphql';

export type PurchaseOrderPaymentsTableRow = {
  amount: number;
  method: PaymentMethod;
  notes?: string;
  paidAt: Date;
};

type Props = React.ComponentProps<typeof TableContainer> & {
  onDelete?: (index: number) => void;
  payments: PurchaseOrderPaymentsTableRow[];
  totalAmount: number;
};

export default function PurchaseOrderPaymentsTable({
  onDelete,
  payments,
  totalAmount,
  ...rest
}: Props): JSX.Element | null {
  const totalPaid = useMemo(() => {
    return calculatePurchaseOrderPaymentsTotalPaid(payments.map(p => p.amount));
  }, [payments]);

  const getBalanceRowColor = useCallback<() => React.ComponentProps<typeof Tr>['bgColor']>(() => {
    if (totalAmount === totalPaid) {
      return 'green.700';
    }

    if (totalPaid === 0) {
      return 'red.700';
    }

    if (totalAmount > totalPaid) {
      return 'yellow.600';
    }

    return 'red.700';
  }, [totalAmount, totalPaid]);

  if (!payments.length) {
    return null;
  }

  return (
    <TableContainer {...rest}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th w="40%">Forma de pago</Th>
            <Th textAlign="center" w="30%">
              Fecha
            </Th>
            <Th textAlign="center" w="30%">
              Monto
            </Th>
            {onDelete && <Th w="0" />}
          </Tr>
        </Thead>

        <Tbody>
          {payments.map((payment, index) => (
            <Tr key={index}>
              <Td>
                <Flex alignItems="center">
                  {paymentMethodText[payment.method]}

                  {payment.notes && (
                    <Popover placement="left">
                      <PopoverTrigger>
                        <IconButton
                          ml="2"
                          aria-label="add"
                          colorScheme="green"
                          rounded="full"
                          icon={<MdStickyNote2 />}
                          size="xs"
                        />
                      </PopoverTrigger>

                      <PopoverContent bg="blue.800" borderColor="blue.800" color="white">
                        <PopoverArrow bg="blue.800" />
                        <PopoverBody whiteSpace="pre-wrap">{payment.notes}</PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )}
                </Flex>
              </Td>
              <Td textAlign="center">{humanReadableDate(payment.paidAt)}</Td>
              <Td textAlign="right">{formatCurrency(payment.amount)}</Td>
              {onDelete && (
                <Td>
                  <IconButton
                    aria-label="delete"
                    colorScheme="red"
                    rounded="full"
                    icon={<MdDelete />}
                    size="xs"
                    onClick={() => onDelete(index)}
                  />
                </Td>
              )}
            </Tr>
          ))}

          <Tr bgColor="gray.200">
            <Td colSpan={3} textAlign="right">
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="blackAlpha.700"
              >
                <Text as="span">Total abonado:</Text> {formatCurrency(totalPaid)}
              </Text>
            </Td>
            {onDelete && <Td />}
          </Tr>

          <Tr bgColor="gray.700">
            <Td colSpan={3} textAlign="right">
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="whiteAlpha.800"
              >
                <Text as="span">Total a pagar:</Text> {formatCurrency(totalAmount)}
              </Text>
            </Td>
            {onDelete && <Td />}
          </Tr>

          <Tr bgColor={getBalanceRowColor()}>
            <Td colSpan={3} textAlign="right">
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="whiteAlpha.800"
              >
                <Text as="span">Balance:</Text> {formatCurrency(totalPaid - totalAmount)}
              </Text>
            </Td>
            {onDelete && <Td />}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
