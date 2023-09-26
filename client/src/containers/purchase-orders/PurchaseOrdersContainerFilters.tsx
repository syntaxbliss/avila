import { Divider, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { Card, FormDateRange, FormSelect, FormSwitch, SuspenseSpinner } from '../../components';
import { MdFilterAltOff } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useSuspenseQuery } from '@apollo/client';
import { useMemo } from 'react';
import {
  PurchaseOrderStatus,
  QuerySortOrder,
  SearchPurchaseOrderDeliveryStatus,
  SearchPurchaseOrderPaymentStatus,
  SearchPurchaseOrderQuerySortField,
} from '../../__generated__/graphql';

export type SearchParams = {
  orderedAtFrom: string;
  orderedAtTo: string;
  supplierId: string;
  paymentStatus: SearchPurchaseOrderPaymentStatus;
  deliveryStatus: SearchPurchaseOrderDeliveryStatus;
  status: PurchaseOrderStatus;
  sortField: SearchPurchaseOrderQuerySortField;
  sortOrder: QuerySortOrder;
};

type Props = {
  onDebouncedChange: (partialUpdate: Partial<SearchParams>) => void;
  onImmediateChange: (partialUpdate: Partial<SearchParams>) => void;
  onReset?: () => void;
  searchParams: SearchParams;
};

const paymentStatusSelectOptions = [
  { label: 'Todas', value: SearchPurchaseOrderPaymentStatus.All },
  { label: 'Pagas', value: SearchPurchaseOrderPaymentStatus.Paid },
  { label: 'Impagas', value: SearchPurchaseOrderPaymentStatus.Unpaid },
];

const deliveryStatusSelectOptions = [
  { label: 'Todas', value: SearchPurchaseOrderDeliveryStatus.All },
  { label: 'Entregadas', value: SearchPurchaseOrderDeliveryStatus.Delivered },
  { label: 'No entregadas', value: SearchPurchaseOrderDeliveryStatus.Undelivered },
];

const sortFieldSelectOptions = [
  { label: 'Fecha de pedido', value: SearchPurchaseOrderQuerySortField.OrderedAt },
  { label: 'Fecha de entrega', value: SearchPurchaseOrderQuerySortField.DeliveredAt },
];

const sortOrderSelectOptions = [
  { label: 'Ascendente', value: QuerySortOrder.Asc },
  { label: 'Descendente', value: QuerySortOrder.Desc },
];

export default function PurchaseOrdersContainerFilters({
  onDebouncedChange,
  onImmediateChange,
  onReset,
  searchParams,
}: Props): JSX.Element {
  return (
    <Card mt="8" title="Filtros">
      <Grid templateColumns="3fr auto 2fr auto auto" gap="5">
        <GridItem>
          <Grid templateColumns="1fr 1fr" gap="5">
            <FormDateRange
              gridColumn="1 / 3"
              label="Fecha de pedido"
              value={[searchParams.orderedAtFrom, searchParams.orderedAtTo]}
              onChange={value =>
                onImmediateChange({ orderedAtFrom: value[0] || '', orderedAtTo: value[1] || '' })
              }
            />

            <FormSelect
              placeholder=""
              label="Estado de pago"
              options={paymentStatusSelectOptions}
              value={searchParams.paymentStatus}
              onChange={e =>
                onImmediateChange({
                  paymentStatus: e.target.value as SearchPurchaseOrderPaymentStatus,
                })
              }
            />

            <FormSelect
              placeholder=""
              label="Estado de entrega"
              options={deliveryStatusSelectOptions}
              value={searchParams.deliveryStatus}
              onChange={e =>
                onImmediateChange({
                  deliveryStatus: e.target.value as SearchPurchaseOrderDeliveryStatus,
                })
              }
            />

            <SuspenseSpinner>
              <SuppliersSelect
                onChange={supplierId => onImmediateChange({ supplierId })}
                supplierId={searchParams.supplierId}
              />
            </SuspenseSpinner>

            <FormSwitch
              mt="9"
              id="purchase-orders-container-filters__cancelled"
              label="Sólo órdenes anuladas"
              value={searchParams.status === PurchaseOrderStatus.Cancelled}
              onChange={e =>
                onImmediateChange({
                  status: e ? PurchaseOrderStatus.Cancelled : PurchaseOrderStatus.Active,
                })
              }
            />
          </Grid>
        </GridItem>

        <GridItem>
          <Divider orientation="vertical" />
        </GridItem>

        <GridItem>
          <Grid templateColumns="1fr 1fr" gap="5">
            <FormSelect
              label="Ordenar por"
              options={sortFieldSelectOptions}
              value={searchParams.sortField}
              onChange={e =>
                onImmediateChange({
                  sortField: e.target.value as SearchPurchaseOrderQuerySortField,
                })
              }
              placeholder=""
            />

            <FormSelect
              label="Sentido"
              options={sortOrderSelectOptions}
              value={searchParams.sortOrder}
              onChange={e => onImmediateChange({ sortOrder: e.target.value as QuerySortOrder })}
              placeholder=""
            />
          </Grid>
        </GridItem>

        <GridItem>
          <Divider orientation="vertical" />
        </GridItem>

        <GridItem>
          <IconButton
            mt="6"
            rounded="full"
            aria-label="clear-filters"
            icon={<MdFilterAltOff />}
            colorScheme="orange"
            onClick={onReset}
            isDisabled={!onReset}
          />
        </GridItem>
      </Grid>
    </Card>
  );
}

SuppliersSelect.gql = {
  queries: {
    suppliers: gql(`
      query SuppliersSelectSuppliersQuery ($includeDeleted: Boolean) {
        suppliers (includeDeleted: $includeDeleted) {
          items {
            id
            name
            deletedAt
          }
        }
      }
    `),
  },
};

type SuppliersSelectProps = {
  onChange: (supplierId: string) => void;
  supplierId: string;
};

function SuppliersSelect({ onChange, supplierId }: SuppliersSelectProps): JSX.Element {
  const { data } = useSuspenseQuery(SuppliersSelect.gql.queries.suppliers, {
    fetchPolicy: 'network-only',
    variables: { includeDeleted: true },
  });

  const options = useMemo(() => {
    return data.suppliers.items.map(supplier => ({
      label: `${supplier.name}${supplier.deletedAt ? ' [ELIMINADO]' : ''}`,
      value: supplier.id,
    }));
  }, [data.suppliers.items]);

  return (
    <FormSelect
      options={options}
      value={supplierId}
      onChange={e => onChange(e.target.value)}
      label="Proveedor"
    />
  );
}
