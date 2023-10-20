import { useSuspenseQuery } from '@apollo/client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureProps,
} from '@chakra-ui/react';
import {
  DividerWithText,
  PurchaseOrderPaymentsTable,
  SuspenseSpinner,
  type PurchaseOrderPaymentsTableRow,
} from '../../components';
import { gql } from '../../__generated__';
import { humanReadableDate } from '../../helpers';
import PurchaseOrderMaterialsTable from '../../components/PurchaseOrderMaterialsTable';

type Props = {
  isOpen: NonNullable<UseDisclosureProps['isOpen']>;
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  purchaseOrderId?: string;
};

export default function PurchaseOrdersContainerDetail({
  isOpen,
  onClose,
  purchaseOrderId,
}: Props): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior="inside">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Detalle de orden de compra</ModalHeader>

        <SuspenseSpinner>
          <PurchaseOrdersContainerDetailContent
            onClose={onClose}
            purchaseOrderId={purchaseOrderId}
          />
        </SuspenseSpinner>
      </ModalContent>
    </Modal>
  );
}

type PurchaseOrdersContainerDetailContentProps = {
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  purchaseOrderId?: string;
};

PurchaseOrdersContainerDetailContent.gql = {
  queries: {
    purchaseOrder: gql(`
      query PurchaseOrdersContainerDetailContentPuchaseOrderQuery ($purchaseOrderId: ID!) {
        purchaseOrder (purchaseOrderId: $purchaseOrderId) {
          id
          orderNumber
          emitter
          conditions
          deliveryLocation
          orderedAt
          deliveredAt
          deliveryNote
          totalAmount
          paidAmount
          supplier {
            name
          }
          materials {
            material {
              code
              name
              measureUnit
            }
            quantity
            unitPrice
          }
          payments {
            id
            method
            amount
            paidAt
            notes
          }
        }
      }
    `),
  },
};

function PurchaseOrdersContainerDetailContent({
  onClose,
  purchaseOrderId,
}: PurchaseOrdersContainerDetailContentProps): JSX.Element | null {
  const { data } = useSuspenseQuery(
    PurchaseOrdersContainerDetailContent.gql.queries.purchaseOrder,
    {
      fetchPolicy: 'network-only',
      variables: { purchaseOrderId: String(purchaseOrderId) },
      skip: !purchaseOrderId,
    }
  );

  if (!data?.purchaseOrder) {
    return null;
  }

  return (
    <>
      <ModalBody>
        <DividerWithText text="Orden" mb="5" />

        <Text>
          <Text as="span" fontWeight="bold">
            Fecha de pedido:
          </Text>{' '}
          {humanReadableDate(data.purchaseOrder.orderedAt)}
        </Text>

        <Text>
          <Text as="span" fontWeight="bold">
            Solicitante:
          </Text>{' '}
          {data.purchaseOrder.emitter}
        </Text>

        {data.purchaseOrder.deliveryLocation && (
          <Text>
            <Text as="span" fontWeight="bold">
              Lugar de entrega:
            </Text>{' '}
            {data.purchaseOrder.deliveryLocation}
          </Text>
        )}

        {data.purchaseOrder.conditions && (
          <Text>
            <Text as="span" fontWeight="bold">
              Condiciones:
            </Text>{' '}
            {data.purchaseOrder.conditions}
          </Text>
        )}

        {data.purchaseOrder.deliveredAt && (
          <Text>
            <Text as="span" fontWeight="bold">
              Fecha de entrega:
            </Text>{' '}
            {humanReadableDate(data.purchaseOrder.deliveredAt)}
          </Text>
        )}

        {data.purchaseOrder.deliveryNote && (
          <Text>
            <Text as="span" fontWeight="bold">
              Remito:
            </Text>{' '}
            {data.purchaseOrder.deliveryNote}
          </Text>
        )}

        <DividerWithText text="Materiales" mt="8" mb="5" />

        <Text>
          <Text as="span" fontWeight="bold">
            Proveedor:
          </Text>{' '}
          {data.purchaseOrder.supplier.name}
        </Text>

        <PurchaseOrderMaterialsTable
          mt="8"
          materials={data.purchaseOrder.materials.map(material => ({
            code: material.material.code,
            measureUnit: material.material.measureUnit,
            name: material.material.name,
            quantity: material.quantity,
            unitPrice: material.unitPrice,
          }))}
        />

        <DividerWithText text="Pagos efectuados" mt="8" mb="5" />

        {data.purchaseOrder.payments ? (
          <PurchaseOrderPaymentsTable
            payments={data.purchaseOrder.payments as PurchaseOrderPaymentsTableRow[]}
            totalAmount={data.purchaseOrder.totalAmount}
          />
        ) : (
          <Text>Esta orden no registra pagos efectuados.</Text>
        )}
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </>
  );
}
