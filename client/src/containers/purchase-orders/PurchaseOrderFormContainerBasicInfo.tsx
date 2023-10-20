import { Divider, Grid } from '@chakra-ui/react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Card, FormInputText, FormSwitch } from '../../components';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';

type FormState = {
  conditions: string;
  delivered: boolean;
  deliveredAt: string;
  deliveryLocation: string;
  deliveryNote: string;
  emitter: string;
  orderedAt: string;
};

type BasicInfo =
  | { conditions: string; deliveryLocation: string; emitter: string; orderedAt: Date }
  | {
      conditions: string;
      deliveredAt: Date;
      deliveryLocation: string;
      deliveryNote: string;
      emitter: string;
      orderedAt: Date;
    };

export type PurchaseOrderFormContainerBasicInfoHandler = () => BasicInfo | undefined;

const formSchema = z
  .object({
    emitter: validationRules.string(true, 1, 250),
    conditions: validationRules.string(true, undefined, 250),
    deliveryLocation: validationRules.string(true, undefined, 250),
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
        emitter: _.get(formattedErrors, 'emitter._errors.0'),
        conditions: _.get(formattedErrors, 'conditions._errors.0'),
        deliveryLocation: _.get(formattedErrors, 'deliveryLocation._errors.0'),
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
      conditions: '',
      delivered: false,
      deliveredAt: '',
      deliveryLocation: '',
      deliveryNote: '',
      emitter: '',
      orderedAt: '',
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

          // FIXME
          console.log(form, validation);

          setFormErrors(validation.errors || {});

          if (validation.data) {
            // FIXME
            return _.pickBy(_.omit(validation.data, 'delivered'), _.identity) as BasicInfo;
          }

          return undefined;
        };
      },
      [form]
    );

    return (
      <Card title="Orden">
        <Grid gridTemplateColumns="repeat(6, 1fr)" gap="5">
          <FormInputText
            autoFocus
            isRequired
            gridColumn="1 / 3"
            type="date"
            label="Fecha de pedido"
            value={form.orderedAt}
            onChange={e => setForm({ ...form, orderedAt: e.target.value })}
            error={formErrors.orderedAt}
          />

          <FormInputText
            isRequired
            gridColumn="3 / 5"
            label="Solicitante"
            value={form.emitter}
            onChange={e => setForm({ ...form, emitter: e.target.value })}
            error={formErrors.emitter}
          />

          <FormInputText
            gridColumn="5 / 7"
            label="Lugar de entrega"
            value={form.deliveryLocation}
            onChange={e => setForm({ ...form, deliveryLocation: e.target.value })}
            error={formErrors.deliveryLocation}
          />

          <FormInputText
            gridColumn="1 / 7"
            label="Condiciones"
            value={form.conditions}
            onChange={e => setForm({ ...form, conditions: e.target.value })}
            error={formErrors.conditions}
          />

          <Divider gridColumn="1 / 7" />

          <FormSwitch
            pt="9"
            gridColumn="1 / 2"
            label="Entregada"
            id="purchase-order-form-container__delivered"
            value={form.delivered}
            onChange={handleDeliveredChange}
          />

          <FormInputText
            isRequired={form.delivered}
            gridColumn="2 / 4"
            type="date"
            label="Fecha de entrega"
            value={form.deliveredAt}
            onChange={e => setForm({ ...form, deliveredAt: e.target.value })}
            error={formErrors.deliveredAt}
            isDisabled={!form.delivered}
          />

          <FormInputText
            gridColumn="4 / 7"
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
