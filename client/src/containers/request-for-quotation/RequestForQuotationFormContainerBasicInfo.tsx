import { Grid } from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Card, FormInputText, PaymentMethodSelect } from '../../components';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';
import { PaymentMethod } from '../../__generated__/graphql';

type FormState = {
  orderedAt: string;
  paymentMethod: PaymentMethod | '';
};

type BasicInfo = { orderedAt: Date; paymentMethod: PaymentMethod };

export type RequestForQuotationFormContainerBasicInfoHandler = () => BasicInfo | undefined;

const formSchema = z.object({
  orderedAt: validationRules.date(),
  paymentMethod: validationRules.enum(PaymentMethod),
});

const validateForm = (input: FormState) => {
  const validation = formSchema.safeParse(_.cloneDeep(input));

  if (!validation.success) {
    const formattedErrors = validation.error.format();

    return {
      success: false,
      errors: {
        orderedAt: _.get(formattedErrors, 'orderedAt._errors.0'),
        paymentMethod: _.get(formattedErrors, 'paymentMethod._errors.0'),
      },
    };
  }

  return { success: true, data: validation.data };
};

const RequestForQuotationFormContainerBasicInfo =
  forwardRef<RequestForQuotationFormContainerBasicInfoHandler>((_props, ref) => {
    const [form, setForm] = useState<FormState>({ orderedAt: '', paymentMethod: '' });
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    useImperativeHandle(
      ref,
      () => {
        return () => {
          const validation = validateForm(form);

          setFormErrors(validation.errors || {});

          if (validation.data) {
            return validation.data as BasicInfo;
          }

          return undefined;
        };
      },
      [form]
    );

    return (
      <Card title="Orden">
        <Grid gridTemplateColumns="1fr 1fr 1fr" gap="5">
          <FormInputText
            autoFocus
            isRequired
            type="date"
            label="Fecha de pedido"
            value={form.orderedAt}
            onChange={e => setForm({ ...form, orderedAt: e.target.value })}
            error={formErrors.orderedAt}
          />

          <PaymentMethodSelect
            isRequired
            label="Forma de pago"
            value={form.paymentMethod}
            onChange={e => setForm({ ...form, paymentMethod: e })}
            error={formErrors.paymentMethod}
          />
        </Grid>
      </Card>
    );
  });

export default RequestForQuotationFormContainerBasicInfo;
