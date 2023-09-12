import { Button, Container, Divider, Grid, GridItem, useToast } from '@chakra-ui/react';
import {
  Card,
  FormInputNumber,
  FormInputText,
  FormSwitch,
  MeasureUnitSelect,
  PageHeader,
} from '../../components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';
import { gql } from '../../__generated__';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { MaterialMeasureUnit } from '../../__generated__/graphql';
import SuspenseSpinner from '../../components/SuspenseSpinner';

type FormState = {
  name: string;
  code: string;
  measureUnit: MaterialMeasureUnit | '';
  stockable: boolean;
  currentQuantity: string;
  alertQuantity: string;
};

const formSchema = z
  .object({
    name: validationRules.string(true, 1, 250),
    code: validationRules.string(true, 1, 20),
    stockable: z.boolean(),
    measureUnit: validationRules.enum(MaterialMeasureUnit),
    currentQuantity: validationRules.decimal(0, 99999999.99, false),
    alertQuantity: validationRules.decimal(0, 99999999.99, false),
  })
  .refine(schema => (schema.stockable ? !_.isUndefined(schema.currentQuantity) : true), {
    path: ['currentQuantity'],
    message: 'Este campo es obligatorio.',
  })
  .refine(schema => (schema.stockable ? !_.isUndefined(schema.alertQuantity) : true), {
    path: ['alertQuantity'],
    message: 'Este campo es obligatorio.',
  });

const validateForm = (input: FormState) => {
  const validation = formSchema.safeParse(_.cloneDeep(input));

  if (!validation.success) {
    const errors = validation.error.format();

    return {
      success: false,
      errors: {
        name: _.get(errors, 'name._errors.0'),
        code: _.get(errors, 'code._errors.0'),
        measureUnit: _.get(errors, 'measureUnit._errors.0'),
        currentQuantity: _.get(errors, 'currentQuantity._errors.0'),
        alertQuantity: _.get(errors, 'alertQuantity._errors.0'),
      },
    };
  }

  return { success: true, data: validation.data };
};

export default function MaterialFormContainer(): JSX.Element {
  const { materialId } = useParams<{ materialId: string }>();
  const isEditing = Boolean(materialId);

  return (
    <>
      <PageHeader title={`${isEditing ? 'Editar' : 'Nuevo'} material`} />

      <Button
        as={Link}
        to={appRoutes.materials.index}
        colorScheme="orange"
        leftIcon={<MdOutlineArrowCircleLeft />}
      >
        Volver
      </Button>

      <SuspenseSpinner>
        <MaterialFormContent materialId={materialId} />
      </SuspenseSpinner>
    </>
  );
}

MaterialFormContent.gql = {
  mutations: {
    createMaterial: gql(`
      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {
        createMaterial(input: $input) {
          id
        }
      }
    `),
    updateMaterial: gql(`
      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {
        updateMaterial(materialId: $materialId, input: $input) {
          id
        }
      }
    `),
  },
  queries: {
    material: gql(`
      query MaterialFormContentMaterialQuery($materialId: ID!) {
        material(materialId: $materialId) {
          id
          name
          code
          measureUnit
          currentQuantity
          alertQuantity
        }
      }
    `),
  },
};

type MaterialFormContentProps = {
  materialId?: string;
};

function MaterialFormContent({ materialId }: MaterialFormContentProps): JSX.Element {
  const { data } = useSuspenseQuery(MaterialFormContent.gql.queries.material, {
    variables: { materialId: String(materialId) },
    skip: !materialId,
  });

  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: data?.material.name ?? '',
    code: data?.material.code ?? '',
    measureUnit: data?.material.measureUnit ?? '',
    stockable: _.isUndefined(data?.material.currentQuantity)
      ? false
      : !_.isNull(data?.material.currentQuantity),
    currentQuantity: _.isUndefined(data?.material.currentQuantity)
      ? ''
      : _.isNull(data?.material.currentQuantity)
      ? ''
      : Number(data?.material.currentQuantity).toFixed(2),
    alertQuantity: _.isUndefined(data?.material.alertQuantity)
      ? ''
      : _.isNull(data?.material.alertQuantity)
      ? ''
      : Number(data?.material.alertQuantity).toFixed(2),
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [createMaterialMutation, createMaterialMutationStatus] = useMutation(
    MaterialFormContent.gql.mutations.createMaterial
  );
  const [updateMaterialMutation, updateMaterialMutationStatus] = useMutation(
    MaterialFormContent.gql.mutations.updateMaterial
  );

  const handleStockableChange = useCallback((checked: boolean) => {
    setForm(form => {
      if (checked) {
        return { ...form, stockable: true };
      }

      return { ...form, stockable: false, currentQuantity: '', alertQuantity: '' };
    });

    if (!checked) {
      setFormErrors(formErrors => ({
        ...formErrors,
        currentQuantity: undefined,
        alertQuantity: undefined,
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const validation = validateForm(form);

      setFormErrors(validation.errors || {});

      if (!validation.errors) {
        if (materialId) {
          updateMaterialMutation({
            variables: {
              materialId,
              input: {
                code: validation.data.code,
                name: validation.data.name,
                measureUnit: validation.data.measureUnit as MaterialMeasureUnit,
                currentQuantity: validation.data.currentQuantity,
                alertQuantity: validation.data.alertQuantity,
              },
            },
            onError(error) {
              if (error.message === 'CODE_TAKEN') {
                setFormErrors(formErrors => ({
                  ...formErrors,
                  code: 'Este código ya se encuentra registrado.',
                }));
              }
            },
            onCompleted() {
              toast({ description: 'Material actualizado exitosamente.' });
              navigate(appRoutes.materials.index);
            },
          });
        } else {
          createMaterialMutation({
            variables: {
              input: {
                code: validation.data.code,
                name: validation.data.name,
                measureUnit: validation.data.measureUnit as MaterialMeasureUnit,
                currentQuantity: validation.data.currentQuantity,
                alertQuantity: validation.data.alertQuantity,
              },
            },
            onError(error) {
              if (error.message === 'CODE_TAKEN') {
                setFormErrors(formErrors => ({
                  ...formErrors,
                  code: 'Este código ya se encuentra registrado.',
                }));
              }
            },
            onCompleted() {
              toast({ description: 'Nuevo material registrado exitosamente.' });
              navigate(appRoutes.materials.index);
            },
          });
        }
      }
    },
    [form, createMaterialMutation, updateMaterialMutation, materialId, toast, navigate]
  );

  return (
    <>
      <Container maxW="container.md" mt="8">
        <Card>
          <Grid
            gridTemplateColumns="repeat(2, 1fr)"
            gap="5"
            as="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <FormInputText
              autoFocus
              isRequired
              label="Nombre"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              gridColumn="1 / 3"
              error={formErrors.name}
            />

            <FormInputText
              isRequired
              label="Código"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              error={formErrors.code}
            />

            <MeasureUnitSelect
              isRequired
              label="Unidad de medida"
              value={form.measureUnit}
              onChange={e => setForm({ ...form, measureUnit: e })}
              error={formErrors.measureUnit}
            />

            <GridItem gridColumn="1 / 3">
              <Divider />
            </GridItem>

            <FormSwitch
              gridColumn="1 / 3"
              label="Controlar stock"
              id="material-form-container__stockable"
              value={form.stockable}
              onChange={handleStockableChange}
            />

            <FormInputNumber
              isDisabled={!form.stockable}
              isRequired
              label="Cantidad actual"
              value={form.currentQuantity}
              onChange={e => setForm({ ...form, currentQuantity: e })}
              error={formErrors.currentQuantity}
            />

            <FormInputNumber
              isDisabled={!form.stockable}
              isRequired
              label="Cantidad de alerta"
              value={form.alertQuantity}
              onChange={e => setForm({ ...form, alertQuantity: e })}
              error={formErrors.alertQuantity}
            />

            <GridItem gridColumn="1 / 3">
              <Divider />
            </GridItem>

            <GridItem display="flex" justifyContent="flex-end" gridColumn="1 / 3">
              <Button
                type="submit"
                colorScheme="orange"
                isLoading={
                  createMaterialMutationStatus.loading || updateMaterialMutationStatus.loading
                }
              >
                Guardar
              </Button>
            </GridItem>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
