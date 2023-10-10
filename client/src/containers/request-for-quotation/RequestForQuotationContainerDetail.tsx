import {
  Button,
  Flex,
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
  RequestForQuotationMaterialsTable,
  SuspenseSpinner,
} from '../../components';
import { gql } from '../../__generated__';
import { useSuspenseQuery } from '@apollo/client';
import { humanReadableDate, paymentMethodText } from '../../helpers';

type Props = {
  isOpen: NonNullable<UseDisclosureProps['isOpen']>;
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  requestForQuotationId?: string;
};

export default function RequestForQuotationContainerDetail({
  isOpen,
  onClose,
  requestForQuotationId,
}: Props): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior="inside">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Detalle de pedido de cotización</ModalHeader>

        <SuspenseSpinner>
          <RequestForQuotationContainerDetailContent
            onClose={onClose}
            requestForQuotationId={requestForQuotationId}
          />
        </SuspenseSpinner>
      </ModalContent>
    </Modal>
  );
}

type RequestForQuotationContainerDetailContentProps = {
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  requestForQuotationId?: string;
};

RequestForQuotationContainerDetailContent.gql = {
  queries: {
    requestForQuotation: gql(`
      query RequestForQuotationContainerDetailRequestForQuotationQuery ($requestForQuotationId: ID!) {
        requestForQuotation (requestForQuotationId: $requestForQuotationId) {
          id
          orderedAt
          paymentMethod
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
        }
      }
    `),
  },
};

function RequestForQuotationContainerDetailContent({
  onClose,
  requestForQuotationId,
}: RequestForQuotationContainerDetailContentProps): JSX.Element | null {
  const { data } = useSuspenseQuery(
    RequestForQuotationContainerDetailContent.gql.queries.requestForQuotation,
    {
      fetchPolicy: 'network-only',
      variables: { requestForQuotationId: String(requestForQuotationId) },
      skip: !requestForQuotationId,
    }
  );

  if (!data?.requestForQuotation) {
    return null;
  }

  return (
    <>
      <ModalBody>
        <DividerWithText text="Orden" mb="5" />

        <Flex alignItems="center">
          <Text>
            <Text as="span" fontWeight="bold">
              Fecha de pedido:
            </Text>{' '}
            {humanReadableDate(data.requestForQuotation.orderedAt)}
          </Text>

          <Text ml="10">
            <Text as="span" fontWeight="bold">
              Forma de pago:
            </Text>{' '}
            {paymentMethodText[data.requestForQuotation.paymentMethod]}
          </Text>
        </Flex>

        <DividerWithText text="Materiales" mt="8" mb="5" />

        <Text>
          <Text as="span" fontWeight="bold">
            Proveedor:
          </Text>{' '}
          {data.requestForQuotation.supplier.name}
        </Text>

        <RequestForQuotationMaterialsTable
          mt="8"
          materials={data.requestForQuotation.materials.map(material => ({
            code: material.material.code,
            measureUnit: material.material.measureUnit,
            name: material.material.name,
            quantity: material.quantity,
            unitPrice: material.unitPrice ?? undefined,
          }))}
        />
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </>
  );
}
