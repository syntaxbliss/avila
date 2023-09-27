import { Button, Container, Flex, useToast } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
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
import PurchaseOrderFormContainerPayments, {
  type PurchaseOrderFormContainerPaymentsHandler,
} from './PurchaseOrderFormContainerPayments';
import { Link, useNavigate } from 'react-router-dom';
import { appRoutes } from '../../routes';

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
          payments {
            id
            amount
            method
            paidAt
            notes
          }
        }
      }
    `),
  },
};

type FormHandlers = {
  basicInfo: PurchaseOrderFormContainerBasicInfoHandler | null;
  materials: PurchaseOrderFormContainerMaterialsHandler | null;
  payments: PurchaseOrderFormContainerPaymentsHandler | null;
};

export default function PurchaseOrderFormContainer(): JSX.Element {
  const handlers = useRef<FormHandlers>({ basicInfo: null, materials: null, payments: null });
  const toast = useToast();
  const navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState(0);

  const [createPurchaseOrderMutation, createPurchaseOrderMutationStatus] = useMutation(
    PurchaseOrderFormContainer.gql.mutations.createPurchaseOrder
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const basicInfo = handlers.current.basicInfo?.();
      const materials = handlers.current.materials?.();
      const payments = handlers.current.payments?.();

      if (basicInfo && materials && payments) {
        createPurchaseOrderMutation({
          variables: {
            input: {
              orderedAt: basicInfo.orderedAt,
              deliveredAt: 'deliveredAt' in basicInfo ? basicInfo.deliveredAt : undefined,
              deliveryNote: 'deliveryNote' in basicInfo ? basicInfo.deliveryNote : undefined,
              supplierId: materials.supplierId,
              updateStock: materials.updateStock,
              materials: materials.materials,
              ...(payments.length ? { payments } : {}),
            },
          },
          onCompleted() {
            toast({ description: 'Nueva orden de compra registrada exitosamente.' });
            navigate(appRoutes.purchaseOrders.index);
          },
        });
      }
    },
    [createPurchaseOrderMutation, toast, navigate]
  );

  return (
    <>
      <PageHeader title="Nueva orden de compra" />

      <Button
        as={Link}
        to={appRoutes.purchaseOrders.index}
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
          onTotalAmountChange={amount => setTotalAmount(amount)}
          ref={e => {
            if (e) {
              handlers.current.materials = e;
            }
          }}
        />

        <PurchaseOrderFormContainerPayments
          mt="5"
          totalAmount={totalAmount}
          ref={e => {
            if (e) {
              handlers.current.payments = e;
            }
          }}
        />

        <Flex mt="5" justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="orange"
            isLoading={createPurchaseOrderMutationStatus.loading}
          >
            Guardar
          </Button>
        </Flex>
      </Container>
    </>
  );
}
