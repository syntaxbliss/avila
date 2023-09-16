import { Button, Container, Divider, Grid, GridItem, useToast } from '@chakra-ui/react';
import { Card, FormInputText, PageHeader, SuspenseSpinner } from '../../components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import _ from 'lodash';
import { validationRules } from '../../validation/rules';
import { gql } from '../../__generated__';
import { useMutation, useSuspenseQuery } from '@apollo/client';

type FormState = {
  name: string;
  address: string;
  email: string;
  phone: string;
};

const formSchema = z.object({
  name: validationRules.string(true, 1, 250),
  address: validationRules.string(true, undefined, 250),
  email: validationRules.email(false),
  phone: validationRules.string(true, undefined, 250),
});

const validateForm = (input: FormState) => {
  const validation = formSchema.safeParse(_.cloneDeep(input));

  if (!validation.success) {
    const errors = validation.error.format();

    return {
      success: false,
      errors: {
        name: _.get(errors, 'name._errors.0'),
        address: _.get(errors, 'address._errors.0'),
        email: _.get(errors, 'email._errors.0'),
        phone: _.get(errors, 'phone._errors.0'),
      },
    };
  }

  return { success: true, data: validation.data };
};

export default function SupplierFormContainer(): JSX.Element {
  const { supplierId } = useParams<{ supplierId: string }>();
  const isEditing = Boolean(supplierId);

  return (
    <>
      <PageHeader title={`${isEditing ? 'Editar' : 'Nuevo'} proveedor`} />

      <Button
        as={Link}
        to={appRoutes.suppliers.index}
        colorScheme="orange"
        leftIcon={<MdOutlineArrowCircleLeft />}
      >
        Volver
      </Button>

      <SuspenseSpinner>
        <SupplierFormContent supplierId={supplierId} />
      </SuspenseSpinner>
    </>
  );
}

SupplierFormContent.gql = {
  mutations: {
    createSupplier: gql(`
      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {
        createSupplier(input: $input) {
          id
          name
          address
          email
          phone
        }
      }
    `),
    updateSupplier: gql(`
      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {
        updateSupplier(supplierId: $supplierId, input: $input) {
          id
          name
          address
          email
          phone
        }
      }
    `),
  },
  queries: {
    supplier: gql(`
      query SupplierFormContentSupplierQuery($supplierId: ID!) {
        supplier(supplierId: $supplierId) {
          id
          name
          address
          email
          phone
        }
      }
    `),
  },
};

type SupplierFormContentProps = {
  supplierId?: string;
};

function SupplierFormContent({ supplierId }: SupplierFormContentProps): JSX.Element {
  const { data } = useSuspenseQuery(SupplierFormContent.gql.queries.supplier, {
    variables: { supplierId: String(supplierId) },
    skip: !supplierId,
  });

  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: data?.supplier.name ?? '',
    address: data?.supplier.address ?? '',
    email: data?.supplier.email ?? '',
    phone: data?.supplier.phone ?? '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [createSupplierMutation, createSupplierMutationStatus] = useMutation(
    SupplierFormContent.gql.mutations.createSupplier
  );
  const [updateSupplierMutation, updateSupplierMutationStatus] = useMutation(
    SupplierFormContent.gql.mutations.updateSupplier
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const validation = validateForm(form);

      setFormErrors(validation.errors || {});

      if (!validation.errors) {
        if (supplierId) {
          updateSupplierMutation({
            variables: {
              supplierId,
              input: {
                name: validation.data.name,
                address: validation.data.address,
                email: validation.data.email,
                phone: validation.data.phone,
              },
            },
            onCompleted() {
              toast({ description: 'Proveedor actualizado exitosamente.' });
              navigate(appRoutes.suppliers.index);
            },
          });
        } else {
          createSupplierMutation({
            variables: {
              input: {
                name: validation.data.name,
                address: validation.data.address,
                email: validation.data.email,
                phone: validation.data.phone,
              },
            },
            onCompleted() {
              toast({ description: 'Nuevo proveedor registrado exitosamente.' });
              navigate(appRoutes.suppliers.index);
            },
          });
        }
      }
    },
    [form, createSupplierMutation, updateSupplierMutation, supplierId, toast, navigate]
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
              label="Dirección"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              gridColumn="1 / 3"
              error={formErrors.address}
            />

            <FormInputText
              label="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              error={formErrors.email}
            />

            <FormInputText
              label="Teléfono"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              error={formErrors.phone}
            />

            <GridItem gridColumn="1 / 3">
              <Divider />
            </GridItem>

            <GridItem display="flex" justifyContent="flex-end" gridColumn="1 / 3">
              <Button
                type="submit"
                colorScheme="orange"
                isLoading={
                  createSupplierMutationStatus.loading || updateSupplierMutationStatus.loading
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
