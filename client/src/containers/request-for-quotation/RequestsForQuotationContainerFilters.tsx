import { Divider, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { QuerySortOrder, SearchRequestForQuotationStatus } from '../../__generated__/graphql';
import { Card, FormDateRange, FormSelect, SuspenseSpinner } from '../../components';
import { MdFilterAltOff } from 'react-icons/md';
import { gql } from '../../__generated__';
import { useSuspenseQuery } from '@apollo/client';
import { useMemo } from 'react';

export type SearchParams = {
  orderedAtFrom: string;
  orderedAtTo: string;
  supplierId: string;
  status: SearchRequestForQuotationStatus;
  sortOrder: QuerySortOrder;
};

type Props = {
  onImmediateChange: (partialUpdate: Partial<SearchParams>) => void;
  onReset?: () => void;
  searchParams: SearchParams;
};

const statusSelectOptions = [
  { label: 'Todos', value: SearchRequestForQuotationStatus.All },
  { label: 'Contestados', value: SearchRequestForQuotationStatus.Answered },
  { label: 'Sin contestar', value: SearchRequestForQuotationStatus.Unanswered },
  {
    label: 'Contestados + Sin contestar',
    value: SearchRequestForQuotationStatus.AnsweredAndUnanswered,
  },
  { label: 'Cancelados', value: SearchRequestForQuotationStatus.Cancelled },
];

const sortOrderSelectOptions = [
  { label: 'Ascendente', value: QuerySortOrder.Asc },
  { label: 'Descendente', value: QuerySortOrder.Desc },
];

export default function RequestsForQuotationContainerFilters({
  onImmediateChange,
  onReset,
  searchParams,
}: Props): JSX.Element {
  return (
    <Card mt="8" title="Filtros">
      <Grid templateColumns="3fr auto 1fr auto auto" gap="5">
        <GridItem>
          <Grid templateColumns="1fr 1fr" gap="5">
            <FormDateRange
              gridColumn="1 / 3"
              maxW="400px"
              label="Fecha de pedido"
              value={[searchParams.orderedAtFrom, searchParams.orderedAtTo]}
              onChange={value =>
                onImmediateChange({ orderedAtFrom: value[0] || '', orderedAtTo: value[1] || '' })
              }
            />

            <FormSelect
              placeholder=""
              label="Estado"
              options={statusSelectOptions}
              value={searchParams.status}
              onChange={e =>
                onImmediateChange({
                  status: e.target.value as SearchRequestForQuotationStatus,
                })
              }
            />

            <SuspenseSpinner>
              <SuppliersSelect
                onChange={supplierId => onImmediateChange({ supplierId })}
                supplierId={searchParams.supplierId}
              />
            </SuspenseSpinner>
          </Grid>
        </GridItem>

        <GridItem>
          <Divider orientation="vertical" />
        </GridItem>

        <GridItem>
          <Grid templateColumns="1fr" gap="5">
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
