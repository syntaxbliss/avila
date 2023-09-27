import { Grid, Text, useToast } from '@chakra-ui/react';
import { ConfirmationDialog, FormInputText, FormSwitch } from '../../components';
import { MdCheck } from 'react-icons/md';
import { PurchaseOrder } from '../../__generated__/graphql';
import { humanReadableDate } from '../../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { validationRules } from '../../validation/rules';
import { gql } from '../../__generated__';
import { useMutation } from '@apollo/client';

PurchaseOrderContainerOrderDeliveredForm.gql = {
  mutations: {
    purchaseOrderDelivered: gql(`
      mutation PurchaseOrderContainerOrderDeliveredFormPurchaseOrderDeliveredMutation ($input: PurchaseOrderDeliveredInput!) {
        purchaseOrderDelivered (input: $input)
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
  deliveredAt: string;
  deliveryNote: string;
  updateStock: boolean;
};

const formSchema = z.object({
  deliveredAt: validationRules.date(),
  deliveryNote: validationRules.string(true, undefined, 100),
  updateStock: z.boolean(),
});

export default function PurchaseOrderContainerOrderDeliveredForm({
  isOpen,
  onClose,
  onConfirm,
  purchaseOrder,
}: Props): JSX.Element {
  const toast = useToast();

  const [form, setForm] = useState<FormState>({
    deliveredAt: '',
    deliveryNote: '',
    updateStock: true,
  });

  const [orderDeliveredMutation, orderDeliveredMutationStatus] = useMutation(
    PurchaseOrderContainerOrderDeliveredForm.gql.mutations.purchaseOrderDelivered
  );

  const validatedForm = useMemo(() => {
    return formSchema.safeParse({ ...form });
  }, [form]);

  const shouldDisableAcceptButton = useMemo(() => {
    return !validatedForm.success;
  }, [validatedForm]);

  const handleAcceptClick = useCallback(() => {
    if (purchaseOrder?.id && validatedForm.success) {
      orderDeliveredMutation({
        variables: {
          input: {
            purchaseOrderId: purchaseOrder.id,
            deliveredAt: validatedForm.data.deliveredAt,
            deliveryNote: validatedForm.data.deliveryNote,
            updateStock: validatedForm.data.updateStock,
          },
        },
        onCompleted() {
          toast({ description: 'Material actualizado exitosamente.' });
          onConfirm();
        },
      });
    }
  }, [purchaseOrder?.id, orderDeliveredMutation, validatedForm, toast, onConfirm]);

  useEffect(() => {
    setForm({ deliveredAt: '', deliveryNote: '', updateStock: true });
  }, [purchaseOrder]);

  return (
    <ConfirmationDialog
      confirmButtonColorScheme="green"
      confirmButtonDisabled={shouldDisableAcceptButton}
      confirmButtonIcon={<MdCheck />}
      confirmButtonText="Confirmar"
      isLoading={orderDeliveredMutationStatus.loading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleAcceptClick}
      size="xl"
      title="Confirmar entrega de orden"
    >
      {purchaseOrder && (
        <>
          <Text>
            <b>Proveedor:</b> {purchaseOrder.supplier.name}
          </Text>
          <Text>
            <b>Fecha de pedido:</b> {humanReadableDate(purchaseOrder.orderedAt)}
          </Text>

          <Grid templateColumns="1fr 1fr" gap="5" mt="8">
            <FormInputText
              isRequired
              type="date"
              label="Fecha de entrega"
              value={form.deliveredAt}
              onChange={e => setForm({ ...form, deliveredAt: e.target.value })}
            />

            <FormInputText
              label="Remito"
              value={form.deliveryNote}
              onChange={e => setForm({ ...form, deliveryNote: e.target.value })}
            />

            <FormSwitch
              gridColumn="1 / 3"
              id="purchase-order-containerorder-delivered-form__update-stock"
              label="Actualizar existencias de material"
              value={form.updateStock}
              onChange={e => setForm({ ...form, updateStock: e })}
            />
          </Grid>
        </>
      )}
    </ConfirmationDialog>
  );
}
