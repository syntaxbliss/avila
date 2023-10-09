import { Divider, Grid, GridItem, Text, useToast } from '@chakra-ui/react';
import {
  ConfirmationDialog,
  DividerWithText,
  FormInputNumber,
  FormInputText,
  FormInputTextarea,
  PaymentMethodSelect,
  PurchaseOrderPaymentsTable,
  SuspenseSpinner,
  type PurchaseOrderPaymentsTableRow,
} from '../../components';
import { MdCheck } from 'react-icons/md';
import {
  PaymentMethod,
  PurchaseOrder,
  PurchaseOrderPaymentInput,
} from '../../__generated__/graphql';
import { formatCurrency, humanReadableDate } from '../../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { validationRules } from '../../validation/rules';
import { gql } from '../../__generated__';
import { useMutation, useSuspenseQuery } from '@apollo/client';

PurchaseOrdersContainerRegisterPaymentForm.gql = {
  queries: {
    payments: gql(`
      query PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQuery ($purchaseOrderId: ID!) {
        purchaseOrder (purchaseOrderId: $purchaseOrderId) {
          payments {
            method
            amount
            paidAt
            notes
          }
        }
      }
    `),
  },
  mutations: {
    registerPayment: gql(`
      mutation PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutation (
        $purchaseOrderId: ID!,
        $input: PurchaseOrderPaymentInput!
      ) {
        registerPurchaseOrderPayment (purchaseOrderId: $purchaseOrderId, input: $input)
      }
    `),
  },
};

type Props = {
  isOpen: React.ComponentProps<typeof ConfirmationDialog>['isOpen'];
  onClose: React.ComponentProps<typeof ConfirmationDialog>['onClose'];
  onConfirm: React.ComponentProps<typeof ConfirmationDialog>['onConfirm'];
  purchaseOrder?: PurchaseOrder;
};

type FormState = {
  method: PaymentMethod | '';
  amount: string;
  paidAt: string;
  notes: string;
};

const formSchema = z.object({
  method: validationRules.enum(PaymentMethod),
  amount: validationRules.decimal(0.01, 99999999.99),
  paidAt: validationRules.date(),
  notes: validationRules.string(true, undefined, 1500),
});

export default function PurchaseOrdersContainerRegisterPaymentForm({
  isOpen,
  onClose,
  onConfirm,
  purchaseOrder,
}: Props): JSX.Element {
  const toast = useToast();

  const [form, setForm] = useState<FormState>({ method: '', amount: '', paidAt: '', notes: '' });

  const [registerPaymentMutation, registerPaymentMutationStatus] = useMutation(
    PurchaseOrdersContainerRegisterPaymentForm.gql.mutations.registerPayment
  );

  const validatedForm = useMemo(() => {
    const validation = formSchema
      .refine(schema => {
        if (purchaseOrder) {
          const newTotalPaid =
            purchaseOrder.paidAmount + parseFloat((schema.amount || 0).toFixed(2));

          return newTotalPaid <= purchaseOrder.totalAmount;
        }

        return false;
      })
      .safeParse({ ...form });

    return validation;
  }, [form, purchaseOrder]);

  const shouldDisableAcceptButton = useMemo(() => {
    return !validatedForm.success;
  }, [validatedForm]);

  const handleAcceptClick = useCallback(() => {
    if (purchaseOrder?.id && validatedForm.success) {
      registerPaymentMutation({
        variables: {
          purchaseOrderId: purchaseOrder.id,
          input: {
            method: validatedForm.data.method,
            amount: validatedForm.data.amount,
            paidAt: validatedForm.data.paidAt,
            notes: validatedForm.data.notes,
          } as PurchaseOrderPaymentInput,
        },
        onCompleted() {
          toast({ description: 'Pago registrado exitosamente.' });
          onConfirm();
        },
      });
    }
  }, [purchaseOrder?.id, registerPaymentMutation, validatedForm, toast, onConfirm]);

  useEffect(() => {
    setForm({ method: '', amount: '', paidAt: '', notes: '' });
  }, [purchaseOrder]);

  return (
    <ConfirmationDialog
      confirmButtonColorScheme="green"
      confirmButtonDisabled={shouldDisableAcceptButton}
      confirmButtonIcon={<MdCheck />}
      confirmButtonText="Registrar"
      isLoading={registerPaymentMutationStatus.loading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleAcceptClick}
      size="2xl"
      title="Registrar pago"
    >
      {purchaseOrder && (
        <>
          <Text>
            <b>Proveedor:</b> {purchaseOrder.supplier.name}
          </Text>
          <Text>
            <b>Fecha de pedido:</b> {humanReadableDate(purchaseOrder.orderedAt)}
          </Text>
          {purchaseOrder.deliveredAt && (
            <Text>
              <b>Fecha de entrega:</b> {humanReadableDate(purchaseOrder.deliveredAt)}
            </Text>
          )}

          <DividerWithText text="Pagos efectuados" mt="8" mb="5" />

          <SuspenseSpinner>
            <PaymentsTable
              purchaseOrderId={purchaseOrder.id}
              totalAmount={purchaseOrder.totalAmount}
            />
          </SuspenseSpinner>

          <Divider my="5" />

          <Grid templateColumns="1fr 1fr 1fr" gap="5" mt="8">
            <PaymentMethodSelect
              isRequired
              label="Forma de pago"
              value={form.method}
              onChange={e => setForm({ ...form, method: e })}
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
        </>
      )}
    </ConfirmationDialog>
  );
}

type PaymentsTableProps = {
  purchaseOrderId: string;
  totalAmount: number;
};

function PaymentsTable({ purchaseOrderId, totalAmount }: PaymentsTableProps): JSX.Element {
  const { data } = useSuspenseQuery(
    PurchaseOrdersContainerRegisterPaymentForm.gql.queries.payments,
    { fetchPolicy: 'network-only', variables: { purchaseOrderId } }
  );

  return (
    <>
      {data.purchaseOrder.payments ? (
        <PurchaseOrderPaymentsTable
          totalAmount={totalAmount}
          payments={data.purchaseOrder.payments as PurchaseOrderPaymentsTableRow[]}
        />
      ) : (
        <>
          <Text>Esta orden no registra pagos efectuados.</Text>
          <Text>
            <b>Total a pagar:</b> {formatCurrency(totalAmount)}
          </Text>
        </>
      )}
    </>
  );
}
