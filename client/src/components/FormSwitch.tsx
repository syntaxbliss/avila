import { FormControl, FormLabel, GridItem, Switch } from '@chakra-ui/react';

type Props = {
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  id: string;
  label: string;
  onChange: (checked: boolean) => void;
  pt?: React.ComponentProps<typeof GridItem>['pt'];
  value: boolean;
};

export default function FormSwitch({
  gridColumn,
  id,
  label,
  onChange,
  pt,
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn} pt={pt}>
      <FormControl display="flex" alignItems="center">
        <Switch id={id} isChecked={value} onChange={e => onChange(e.target.checked)} />

        <FormLabel htmlFor={id} mb="0" ml="3" mr="0">
          {label}
        </FormLabel>
      </FormControl>
    </GridItem>
  );
}
