import { Divider, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { Card, FormInputText, FormSelect } from '../../components';
import { MdFilterAltOff } from 'react-icons/md';
import { QuerySortOrder } from '../../__generated__/graphql';

export type SearchParams = {
  name: string;
  sortOrder: QuerySortOrder;
};

type Props = {
  onDebouncedChange: (partialUpdate: Partial<SearchParams>) => void;
  onImmediateChange: (partialUpdate: Partial<SearchParams>) => void;
  onReset?: () => void;
  searchParams: SearchParams;
};

const sortOrderSelectOptions = [
  { label: 'Ascendente', value: QuerySortOrder.Asc },
  { label: 'Descendente', value: QuerySortOrder.Desc },
];

export default function SuppliersContainerFilters({
  onDebouncedChange,
  onImmediateChange,
  onReset,
  searchParams,
}: Props): JSX.Element {
  return (
    <Card mt="8" title="Filtros">
      <Grid templateColumns="1fr auto 1fr auto auto" gap="5">
        <FormInputText
          label="Nombre"
          value={searchParams.name}
          onChange={e => onDebouncedChange({ name: e.target.value })}
        />

        <GridItem>
          <Divider orientation="vertical" />
        </GridItem>

        <GridItem>
          <FormSelect
            label="Sentido"
            options={sortOrderSelectOptions}
            value={searchParams.sortOrder}
            onChange={e => onImmediateChange({ sortOrder: e.target.value as QuerySortOrder })}
            placeholder=""
          />
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
