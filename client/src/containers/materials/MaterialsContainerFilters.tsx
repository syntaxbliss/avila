import { Divider, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { Card, FormInputText, FormSelect, FormSwitch } from '../../components';
import { MdFilterAltOff } from 'react-icons/md';
import { QuerySortOrder, SearchMaterialQuerySortField } from '../../__generated__/graphql';

export type SearchParams = {
  code: string;
  name: string;
  lowQuantity: boolean;
  sortField: SearchMaterialQuerySortField;
  sortOrder: QuerySortOrder;
};

type Props = {
  onDebouncedChange: (partialUpdate: Partial<SearchParams>) => void;
  onImmediateChange: (partialUpdate: Partial<SearchParams>) => void;
  onReset?: () => void;
  searchParams: SearchParams;
};

const sortFieldSelectOptions = [
  { label: 'Nombre', value: SearchMaterialQuerySortField.Name },
  { label: 'Código', value: SearchMaterialQuerySortField.Code },
];

const sortOrderSelectOptions = [
  { label: 'Ascendente', value: QuerySortOrder.Asc },
  { label: 'Descendente', value: QuerySortOrder.Desc },
];

export default function MaterialsContainerFilters({
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

            <FormSwitch
              gridColumn="1 / 3"
              label="Sólo materiales con bajas existencias"
              id="materials-container-filters__low-quantity"
              value={searchParams.lowQuantity}
              onChange={e => onImmediateChange({ lowQuantity: e })}
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
                  sortField: e.target.value as SearchMaterialQuerySortField,
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
