import { Divider, Grid, GridItem, IconButton, Text } from '@chakra-ui/react';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Card,
  FormInputNumber,
  FormInputText,
  FormInputTextarea,
  PaymentMethodSelect,
  PurchaseOrderPaymentsTable,
} from '../../components';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';
import { MdAdd } from 'react-icons/md';
import { PurchaseOrderPaymentMethod } from '../../__generated__/graphql';

type Props = React.ComponentProps<typeof Card> & { totalAmount: number };

type FormState = {
  method: PurchaseOrderPaymentMethod | '';
  amount: string;
  paidAt: string;
  notes: string;
};

type Payments = Array<{
  method: PurchaseOrderPaymentMethod;
  amount: number;
  paidAt: Date;
  notes?: string;
}>;

export type PurchaseOrderFormContainerPaymentsHandler = () => Payments | undefined;

const formSchema = z.object({
  method: validationRules.enum(PurchaseOrderPaymentMethod),
  amount: validationRules.decimal(0.01, 99999999.99),
  paidAt: validationRules.date(),
  notes: validationRules.string(true, undefined, 1500),
});

const initialValues: FormState = { method: '', amount: '', paidAt: '', notes: '' };

const PurchaseOrderFormContainerPayments = forwardRef<
  PurchaseOrderFormContainerPaymentsHandler,
  Props
>(({ totalAmount, ...rest }, ref) => {
  const [form, setForm] = useState<FormState>({ ...initialValues });
  const [paymentsList, setPaymentsList] = useState<Payments>([]);
  const [showPaymentsError, setShowPaymentsError] = useState(false);
  const methodSelectRef = useRef<HTMLSelectElement>(null);

  const totalPaid = useMemo(() => {
    const totalPaid = paymentsList.reduce((sum, payment) => {
      sum += payment.amount;

      return sum;
    }, 0);

    return Number(totalPaid.toFixed(2));
  }, [paymentsList]);

  const shouldDisableAddButton = useMemo(() => {
    const validation = formSchema.safeParse(_.cloneDeep(form));

    return !validation.success;
  }, [form]);

  const handleAddClick = useCallback(() => {
    const payment = formSchema.parse(form) as Payments[number];

    setPaymentsList(list => [
      ...list,
      {
        method: payment.method,
        amount: payment.amount,
        paidAt: payment.paidAt,
        ...(payment.notes ? { notes: payment.notes } : {}),
      },
    ]);
    setForm({ ...initialValues });
    methodSelectRef.current?.focus();
  }, [form]);

  const handleDeleteClick = useCallback((index: number) => {
    setPaymentsList(list => {
      const newList = [...list];

      newList.splice(index, 1);

      return newList;
    });
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return () => {
        setShowPaymentsError(false);

        if (totalPaid > totalAmount) {
          setShowPaymentsError(true);

          return undefined;
        }

        return paymentsList;
      };
    },
    [paymentsList, totalPaid, totalAmount]
  );

  return (
    <Card title="Pagos efectuados" {...rest}>
      <PurchaseOrderPaymentsTable
        onDelete={handleDeleteClick}
        payments={paymentsList.sort((a, b) => {
          return b.paidAt.getTime() - a.paidAt.getTime();
        })}
        totalAmount={totalAmount}
      />

      {paymentsList.length > 0 && <Divider my="5" />}

      <Grid gridTemplateColumns="1fr auto" gap="5">
        <GridItem>
          <Grid gridTemplateColumns="1fr 1fr 1fr" gap="5">
            <PaymentMethodSelect
              isRequired
              label="Forma de pago"
              value={form.method}
              onChange={e => setForm({ ...form, method: e })}
              ref={methodSelectRef}
            />

            <GridItem display="flex">
              <Text flex={0} minW="20px" mt="8">
                $
              </Text>

              <FormInputNumber
                isRequired
                label="Monto"
                min={0.01}
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e })}
              />
            </GridItem>

            <FormInputText
              isRequired
              label="Fecha"
              type="date"
              value={form.paidAt}
              onChange={e => setForm({ ...form, paidAt: e.target.value })}
            />

            <FormInputTextarea
              gridColumn="1 / 4"
              label="Notas"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </Grid>
        </GridItem>

        <GridItem>
          <IconButton
            mt="8"
            aria-label="add"
            colorScheme="green"
            rounded="full"
            icon={<MdAdd />}
            size="xs"
            onClick={handleAddClick}
            isDisabled={shouldDisableAddButton}
          />
        </GridItem>
      </Grid>

      {showPaymentsError && (
        <Text color="red.500" mt="2" fontSize="sm">
          La suma de los pagos registrados es mayor al monto a pagar.
        </Text>
      )}
    </Card>
  );
});

export default PurchaseOrderFormContainerPayments;
