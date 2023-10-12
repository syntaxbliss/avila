import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import {
  Card,
  LoadingSpinner,
  NoRecordsAlert,
  PageHeader,
  RequestForQuotationMaterialsTable,
  SuspenseSpinner,
} from '../../components';
import { MdList, MdOutlineArrowCircleLeft } from 'react-icons/md';
import PurchaseOrderFormContainerBasicInfo, {
  type PurchaseOrderFormContainerBasicInfoHandler,
} from './PurchaseOrderFormContainerBasicInfo';
import PurchaseOrderFormContainerMaterials, {
  type PurchaseOrderFormContainerMaterialsHandler,
} from './PurchaseOrderFormContainerMaterials';
import { gql } from '../../__generated__';
import { useMutation, useQuery, useSuspenseQuery } from '@apollo/client';
import PurchaseOrderFormContainerPayments, {
  type PurchaseOrderFormContainerPaymentsHandler,
} from './PurchaseOrderFormContainerPayments';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { appRoutes } from '../../routes';
import { humanReadableDate, paymentMethodText } from '../../helpers';
import { RequestForQuotation } from '../../__generated__/graphql';
import _ from 'lodash';

PurchaseOrderFormContainer.gql = {
  queries: {
    requestForQuotation: gql(`
      query PurchaseOrderFormContainerRequestForQuotationQuery ($requestForQuotationId: ID!) {
        requestForQuotation (requestForQuotationId: $requestForQuotationId) {
          id
          orderedAt
          paymentMethod
          hasAssociatedPurchaseOrder
          supplier {
            id
            name
          }
          materials {
            material {
              id
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
  const [params] = useSearchParams();
  const rfqId = params.get('rfqId');

  const [generationData, setGenerationData] = useState<{ rfq?: RequestForQuotation }>();
  const [totalAmount, setTotalAmount] = useState(0);

  const requestForQuotationQuery = useQuery(
    PurchaseOrderFormContainer.gql.queries.requestForQuotation,
    {
      fetchPolicy: 'network-only',
      skip: !rfqId,
      variables: { requestForQuotationId: String(rfqId) },
      onCompleted(response) {
        if (!response.requestForQuotation.hasAssociatedPurchaseOrder) {
          setGenerationData({ rfq: response.requestForQuotation as RequestForQuotation });
        }
      },
    }
  );

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
              requestForQuotationId: generationData?.rfq?.id,
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
    [createPurchaseOrderMutation, toast, navigate, generationData?.rfq?.id]
  );

  if (requestForQuotationQuery.loading) {
    return <LoadingSpinner />;
  }

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

      {!generationData && !rfqId && (
        <GenerationModeForm onChange={rfq => setGenerationData({ rfq })} />
      )}

      {!_.isUndefined(generationData) && (
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
            requestForQuotation={generationData.rfq}
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
      )}
    </>
  );
}

type GenerationModeFormProps = {
  onChange: (rfq?: RequestForQuotation) => void;
};

enum GenerationModeEnum {
  FROM_RFQ = 'from-rfq',
  MANUAL = 'manual',
}

function GenerationModeForm({ onChange }: GenerationModeFormProps): JSX.Element {
  const [mode, setMode] = useState<GenerationModeEnum>(GenerationModeEnum.FROM_RFQ);
  const [selectedRFQ, setSelectedRFQ] = useState<RequestForQuotation>();

  return (
    <Container maxW="container.lg" mt="8">
      <Card mt="8">
        <Grid templateColumns="2fr auto 1fr" gap="5">
          <GridItem>
            <Radio
              name="generation-mode"
              value={GenerationModeEnum.FROM_RFQ}
              isChecked={mode === GenerationModeEnum.FROM_RFQ}
              onChange={e => setMode(e.target.value as GenerationModeEnum)}
            >
              Desde pedido de cotización
            </Radio>

            <SuspenseSpinner>
              <EligibleRequestsForQuotationList
                onChange={rfq => {
                  setSelectedRFQ(rfq);
                  setMode(GenerationModeEnum.FROM_RFQ);
                }}
                selectedId={selectedRFQ?.id}
              />
            </SuspenseSpinner>
          </GridItem>

          <Divider orientation="vertical" />

          <GridItem>
            <Radio
              name="generation-mode"
              value={GenerationModeEnum.MANUAL}
              isChecked={mode === GenerationModeEnum.MANUAL}
              onChange={e => {
                setSelectedRFQ(undefined);
                setMode(e.target.value as GenerationModeEnum);
              }}
            >
              Manual
            </Radio>
          </GridItem>

          <Divider gridColumn="1 / 4" />

          <GridItem gridColumn="1 / 4" display="flex" justifyContent="flex-end">
            <Button
              colorScheme="orange"
              isDisabled={mode === GenerationModeEnum.FROM_RFQ && !selectedRFQ}
              onClick={() => onChange(selectedRFQ || undefined)}
            >
              Continuar
            </Button>
          </GridItem>
        </Grid>
      </Card>
    </Container>
  );
}

EligibleRequestsForQuotationList.gql = {
  queries: {
    eligibleRequestsForQuotation: gql(`
      query EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQuery {
        requestsForQuotationEligibleForPurchaseOrders {
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

type EligibleRequestsForQuotationListProps = {
  onChange: (rfq?: RequestForQuotation) => void;
  selectedId?: string;
};

function EligibleRequestsForQuotationList({
  onChange,
  selectedId,
}: EligibleRequestsForQuotationListProps): JSX.Element {
  const {
    data: { requestsForQuotationEligibleForPurchaseOrders },
  } = useSuspenseQuery(EligibleRequestsForQuotationList.gql.queries.eligibleRequestsForQuotation, {
    fetchPolicy: 'network-only',
  });

  const [showDetail, setShowDetail] = useState<Partial<RequestForQuotation>>();
  const detailDialog = useDisclosure({
    isOpen: Boolean(showDetail),
    onClose: () => setShowDetail(undefined),
  });

  return (
    <>
      <VStack
        mt="8"
        maxH="400px"
        overflow="auto"
        p="2"
        bgColor="gray.50"
        borderWidth="1px"
        rounded="md"
      >
        {requestsForQuotationEligibleForPurchaseOrders.length ? (
          requestsForQuotationEligibleForPurchaseOrders.map(rfq => (
            <Box
              key={rfq.id}
              w="full"
              onClick={() =>
                onChange(selectedId === rfq.id ? undefined : (rfq as RequestForQuotation))
              }
            >
              <Card
                w="full"
                py="3"
                px="4"
                cursor="pointer"
                direction="row"
                {...(selectedId === rfq.id
                  ? { borderColor: 'green.500', bgColor: 'green.50' }
                  : { _hover: { borderColor: 'blue.500', bgColor: 'blue.50' } })}
              >
                <Box flex={1}>
                  <Text>
                    <Text fontWeight="bold" as="span">
                      Proveedor:
                    </Text>{' '}
                    {rfq.supplier.name}
                  </Text>

                  <Text>
                    <Text fontWeight="bold" as="span">
                      Fecha de pedido:
                    </Text>{' '}
                    {humanReadableDate(rfq.orderedAt)}
                  </Text>

                  <Text>
                    <Text fontWeight="bold" as="span">
                      Forma de pago:
                    </Text>{' '}
                    {paymentMethodText[rfq.paymentMethod]}
                  </Text>
                </Box>

                <IconButton
                  aria-label="detail"
                  colorScheme="green"
                  rounded="full"
                  icon={<MdList />}
                  size="xs"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDetail(rfq as RequestForQuotation);
                  }}
                />
              </Card>
            </Box>
          ))
        ) : (
          <NoRecordsAlert entity="pedidos de cotización elegibles para órdenes de compra." />
        )}
      </VStack>

      <Modal
        isOpen={detailDialog.isOpen}
        onClose={detailDialog.onClose}
        size="4xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Detalle de pedido de cotización</ModalHeader>

          <ModalBody>
            <RequestForQuotationMaterialsTable
              mt="8"
              materials={
                showDetail?.materials
                  ? showDetail.materials.map(material => ({
                      code: material.material.code,
                      measureUnit: material.material.measureUnit,
                      name: material.material.name,
                      quantity: material.quantity,
                      unitPrice: material.unitPrice ?? undefined,
                    }))
                  : []
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={detailDialog.onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
