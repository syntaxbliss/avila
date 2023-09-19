import { Button, Container } from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { PageHeader } from '../../components';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';
import PurchaseOrderFormContainerBasicInfo, {
  type PurchaseOrderFormContainerBasicInfoHandler,
} from './PurchaseOrderFormContainerBasicInfo';
import PurchaseOrderFormContainerMaterials, {
  type PurchaseOrderFormContainerMaterialsHandler,
} from './PurchaseOrderFormContainerMaterials';
import { gql } from '../../__generated__';
import { useMutation } from '@apollo/client';

PurchaseOrderFormContainer.gql = {
  mutations: {
    createPurchaseOrder: gql(`
      mutation PurchaseOrderFormContainerCreatePurchaseOrderMutation($input: CreatePurchaseOrderInput!) {
        createPurchaseOrder(input: $input) {
          id
          orderedAt
          deliveredAt
          deliveryNote
          totalAmount
          paidAmount
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
  basicInfo: PurchaseOrderFormContainerBasicInfoHandler | null;
  materials: PurchaseOrderFormContainerMaterialsHandler | null;
};

export default function PurchaseOrderFormContainer(): JSX.Element {
  const handlers = useRef<FormHandlers>({ basicInfo: null, materials: null });
  const [createPurchaseOrderMutation, createPurchaseOrderMutationStatus] = useMutation(
    PurchaseOrderFormContainer.gql.mutations.createPurchaseOrder
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const basicInfo = handlers.current.basicInfo?.();
      const materials = handlers.current.materials?.();

      console.log('*** FORMS ***', { basicInfo, materials });

      if (basicInfo && materials) {
        createPurchaseOrderMutation({
          variables: {
            input: {
              orderedAt: basicInfo.orderedAt,
              deliveredAt: 'deliveredAt' in basicInfo ? basicInfo.deliveredAt : undefined,
              deliveryNote: 'deliveryNote' in basicInfo ? basicInfo.deliveryNote : undefined,
              supplierId: materials.supplierId,
              materials: materials.materials,
            },
          },
        });
      }
    },
    [createPurchaseOrderMutation]
  );

  return (
    <>
      <PageHeader title="Nueva orden de compra" />

      <Button
        // as={Link}
        // to={appRoutes.materials.index}
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
        <PurchaseOrderFormContainerBasicInfo
          ref={e => {
            if (e) {
              handlers.current.basicInfo = e;
            }
          }}
        />

        <PurchaseOrderFormContainerMaterials
          mt="5"
          ref={e => {
            if (e) {
              handlers.current.materials = e;
            }
          }}
        />

        <Button
          type="submit"
          colorScheme="orange"
          isLoading={createPurchaseOrderMutationStatus.loading}
          display="block"
          ml="auto"
          mt="5"
        >
          Guardar
        </Button>
      </Container>
    </>
  );
}
