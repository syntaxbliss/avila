import { FormControl, FormErrorMessage, FormLabel, GridItem, Input } from '@chakra-ui/react';
import { IconType } from 'react-icons';

type Props = {
  autoFocus?: React.ComponentProps<typeof Input>['autoFocus'];
  error?: string;
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isRequired?: React.ComponentProps<typeof Input>['isRequired'];
  label?: string;
  leftElement?: {
    icon: IconType;
  };
  onChange: React.ComponentProps<typeof Input>['onChange'];
  rightElement?: {
    ariaLabel: string;
    icon: IconType;
    onClick: () => void;
  };
  type?: React.HTMLInputTypeAttribute;
  value: React.ComponentProps<typeof Input>['value'];
};

export default function FormInputText({
  autoFocus,
  error,
  gridColumn,
  isRequired,
  label,
  onChange,
  type = 'text',
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn}>
      <FormControl isRequired={isRequired} isInvalid={Boolean(error)}>
        {label && <FormLabel>{label}</FormLabel>}

        <Input
          autoFocus={autoFocus}
          variant="filled"
          type={type}
          value={value}
          onChange={onChange}
        />

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </GridItem>
  );
}
