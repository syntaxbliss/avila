import { Divider, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { QuerySortOrder, SearchMachineQuerySortField } from '../../__generated__/graphql';
import { Card, FormInputText, FormSelect } from '../../components';
import { MdFilterAltOff } from 'react-icons/md';

export type SearchParams = {
  code: string;
  name: string;
  sortField: SearchMachineQuerySortField;
  sortOrder: QuerySortOrder;
};

type Props = {
  onDebouncedChange: (partialUpdate: Partial<SearchParams>) => void;
  onImmediateChange: (partialUpdate: Partial<SearchParams>) => void;
  onReset?: () => void;
  searchParams: SearchParams;
};

const sortFieldSelectOptions = [
  { label: 'Nombre', value: SearchMachineQuerySortField.Name },
  { label: 'Código', value: SearchMachineQuerySortField.Code },
];

const sortOrderSelectOptions = [
  { label: 'Ascendente', value: QuerySortOrder.Asc },
  { label: 'Descendente', value: QuerySortOrder.Desc },
];

export default function MachinesContainerFilters({
  onDebouncedChange,
  onImmediateChange,
  onReset,
  searchParams,
}: Props): JSX.Element {
  return (
    <Card mt="8" title="Filtros">
      <Grid templateColumns="1fr auto 1fr auto auto" gap="5">
        <GridItem>
          <Grid templateColumns="1fr 1fr" gap="5">
            <FormInputText
              label="Código"
              value={searchParams.code}
              onChange={e => onDebouncedChange({ code: e.target.value.toUpperCase() })}
            />

            <FormInputText
              label="Nombre"
              value={searchParams.name}
              onChange={e => onDebouncedChange({ name: e.target.value })}
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
                  sortField: e.target.value as SearchMachineQuerySortField,
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
