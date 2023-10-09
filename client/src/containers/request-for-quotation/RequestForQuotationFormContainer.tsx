import { useCallback, useRef } from 'react';
import { gql } from '../../__generated__';
import { Button, Container, Flex, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { PageHeader } from '../../components';
import { appRoutes } from '../../routes';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';
import RequestForQuotationFormContainerBasicInfo, {
  type RequestForQuotationFormContainerBasicInfoHandler,
} from './RequestForQuotationFormContainerBasicInfo';
import RequestForQuotationFormContainerMaterials, {
  type RequestForQuotationFormContainerMaterialsHandler,
} from './RequestForQuotationFormContainerMaterials';

RequestForQuotationFormContainer.gql = {
  mutations: {
    createRequestForQuotation: gql(`
      mutation RequestForQuotationFormContainerCreateRequestForQuotationMutation($input: CreateRequestForQuotationInput!) {
        createRequestForQuotation(input: $input) {
          id
          orderedAt
          paymentMethod
          supplier {
            id
            name
          }
          materials {
            material {
              id
              name
            }
            quantity
            unitPrice
          }
        }
      }
    `),
  },
};

type FormHandlers = {
  basicInfo: RequestForQuotationFormContainerBasicInfoHandler | null;
  materials: RequestForQuotationFormContainerMaterialsHandler | null;
};

export default function RequestForQuotationFormContainer(): JSX.Element {
  const handlers = useRef<FormHandlers>({ basicInfo: null, materials: null });
  const toast = useToast();
  const navigate = useNavigate();

  const [createRequestForQuotationMutation, createRequestForQuotationMutationStatus] = useMutation(
    RequestForQuotationFormContainer.gql.mutations.createRequestForQuotation
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const basicInfo = handlers.current.basicInfo?.();
      const materials = handlers.current.materials?.();

      if (basicInfo && materials) {
        createRequestForQuotationMutation({
          variables: {
            input: {
              orderedAt: basicInfo.orderedAt,
              paymentMethod: basicInfo.paymentMethod,
              supplierId: materials.supplierId,
              materials: materials.materials,
            },
          },
          onCompleted() {
            toast({ description: 'Nuevo pedido de cotización registrado exitosamente.' });
            navigate(appRoutes.requestForQuotations.index);
          },
        });
      }
    },
    [createRequestForQuotationMutation, toast, navigate]
  );

  return (
    <>
      <PageHeader title="Nuevo pedido de cotización" />

      <Button
        as={Link}
        to={appRoutes.requestForQuotations.index}
        colorScheme="orange"
        leftIcon={<MdOutlineArrowCircleLeft />}
      >
        Volver
      </Button>

      <Container
        maxW="container.lg"
        mt="8"
        as="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <RequestForQuotationFormContainerBasicInfo
          ref={e => {
            if (e) {
              handlers.current.basicInfo = e;
            }
          }}
        />

        <RequestForQuotationFormContainerMaterials
          mt="5"
          ref={e => {
            if (e) {
              handlers.current.materials = e;
            }
          }}
        />

        <Flex mt="5" justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="orange"
            isLoading={createRequestForQuotationMutationStatus.loading}
          >
            Guardar
          </Button>
        </Flex>
      </Container>
    </>
  );
}
