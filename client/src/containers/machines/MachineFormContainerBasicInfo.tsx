import { z } from 'zod';
import { Machine } from '../../__generated__/graphql';
import { validationRules } from '../../validation/rules';
import _ from 'lodash';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Grid } from '@chakra-ui/react';
import { Card, FormInputText } from '../../components';

type Props = {
  machine?: Machine;
};

type FormState = {
  name: string;
};

type BasicInfo = { name: string };

export type MachineFormContainerBasicInfoHandler = () => BasicInfo | undefined;

const formSchema = z.object({ name: validationRules.string(true, 1, 250) });

const validateForm = (input: FormState) => {
  const validation = formSchema.safeParse(_.cloneDeep(input));

  if (!validation.success) {
    const formattedErrors = validation.error.format();

    return {
      success: false,
      errors: {
        name: _.get(formattedErrors, 'name._errors.0'),
      },
    };
  }

  return { success: true, data: validation.data };
};

const MachineFormContainerBasicInfo = forwardRef<MachineFormContainerBasicInfoHandler, Props>(
  ({ machine }, ref) => {
    const [form, setForm] = useState<FormState>({ name: machine?.name ?? '' });
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
      <Card title="Máquina">
        <Grid gridTemplateColumns="repeat(4, 1fr)" gap="5">
          <FormInputText
            autoFocus
            gridColumn="1 / 3"
            isRequired
            label="Nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
          />
        </Grid>
      </Card>
    );
  }
);

export default MachineFormContainerBasicInfo;
