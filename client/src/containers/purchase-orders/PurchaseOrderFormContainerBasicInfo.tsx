import { Divider, Grid, GridItem } from '@chakra-ui/react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Card, FormInputText, FormSwitch } from '../../components';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';

type FormState = {
  orderedAt: string;
  delivered: boolean;
  deliveredAt: string;
  deliveryNote: string;
};

type BasicInfo = { orderedAt: Date } | { orderedAt: Date; deliveredAt: Date; deliveryNote: string };

export type PurchaseOrderFormContainerBasicInfoHandler = () => BasicInfo | undefined;

const formSchema = z
  .object({
    orderedAt: validationRules.date(),
    delivered: z.boolean(),
    deliveredAt: validationRules.date(false),
    deliveryNote: validationRules.string(true, undefined, 100),
  })
  .refine(schema => (schema.delivered ? !_.isUndefined(schema.deliveredAt) : true), {
    path: ['deliveredAt'],
    message: 'Seleccione una fecha válida.',
  });

const validateForm = (input: FormState) => {
  const validation = formSchema.safeParse(_.cloneDeep(input));

  if (!validation.success) {
    const formattedErrors = validation.error.format();

    return {
      success: false,
      errors: {
        orderedAt: _.get(formattedErrors, 'orderedAt._errors.0'),
        deliveredAt: _.get(formattedErrors, 'deliveredAt._errors.0'),
        deliveryNote: _.get(formattedErrors, 'deliveryNote._errors.0'),
      },
    };
  }

  return { success: true, data: validation.data };
};

const PurchaseOrderFormContainerBasicInfo = forwardRef<PurchaseOrderFormContainerBasicInfoHandler>(
  (_props, ref) => {
    const [form, setForm] = useState<FormState>({
      orderedAt: '',
      delivered: false,
      deliveredAt: '',
      deliveryNote: '',
    });
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    const handleDeliveredChange = useCallback((checked: boolean) => {
      setForm(form => {
        if (checked) {
          return { ...form, delivered: true };
        }

        return { ...form, delivered: false, deliveredAt: '', deliveryNote: '' };
      });
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return () => {
          const validation = validateForm(form);

          setFormErrors(validation.errors || {});

          if (validation.data) {
            return _.pickBy(_.omit(validation.data, 'delivered'), _.identity) as BasicInfo;
          }

          return undefined;
        };
      },
      [form]
    );

    return (
      <Card title="Orden">
        <Grid gridTemplateColumns="1fr auto auto 1fr 1fr" gap="5">
          <FormInputText
            autoFocus
            isRequired
            type="date"
            label="Fecha de pedido"
            value={form.orderedAt}
            onChange={e => setForm({ ...form, orderedAt: e.target.value })}
            error={formErrors.orderedAt}
          />

          <GridItem>
            <Divider orientation="vertical" />
          </GridItem>

          <FormSwitch
            pt="9"
            label="Entregada"
            id="purchase-order-form-container__delivered"
            value={form.delivered}
            onChange={handleDeliveredChange}
          />

          <FormInputText
            isRequired
            type="date"
            label="Fecha de entrega"
            value={form.deliveredAt}
            onChange={e => setForm({ ...form, deliveredAt: e.target.value })}
            error={formErrors.deliveredAt}
            isDisabled={!form.delivered}
          />

          <FormInputText
            label="Remito"
            value={form.deliveryNote}
            onChange={e => setForm({ ...form, deliveryNote: e.target.value })}
            error={formErrors.deliveryNote}
            isDisabled={!form.delivered}
          />
        </Grid>
      </Card>
    );
  }
);

export default PurchaseOrderFormContainerBasicInfo;
