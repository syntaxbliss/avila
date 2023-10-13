import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

type Props = {
  autoFocus?: React.ComponentProps<typeof Input>['autoFocus'];
  error?: string;
  flex?: React.ComponentProps<typeof GridItem>['flex'];
  gridColumn?: React.ComponentProps<typeof GridItem>['gridColumn'];
  isDisabled?: React.ComponentProps<typeof Input>['isDisabled'];
  isRequired?: React.ComponentProps<typeof Input>['isRequired'];
  label?: string;
  onChange: React.ComponentProps<typeof Input>['onChange'];
  rightElement?: {
    ariaLabel: string;
    color?: React.ComponentProps<typeof Icon>['color'];
    icon: IconType;
    onClick: () => void;
  };
  type?: React.HTMLInputTypeAttribute;
  value: React.ComponentProps<typeof Input>['value'];
};

export default function FormInputText({
  autoFocus,
  error,
  flex,
  gridColumn,
  isDisabled,
  isRequired,
  label,
  onChange,
  rightElement,
  type = 'text',
  value,
}: Props): JSX.Element {
  return (
    <GridItem gridColumn={gridColumn} flex={flex}>
      <FormControl isRequired={isRequired} isInvalid={Boolean(error)}>
        {label && <FormLabel>{label}</FormLabel>}

        {rightElement ? (
          <InputGroup>
            <Input
              autoFocus={autoFocus}
              isDisabled={isDisabled}
              variant="filled"
              type={type}
              value={value}
              onChange={onChange}
            />

            <InputRightElement>
              <IconButton
                aria-label={rightElement.ariaLabel}
                isRound
                variant="ghost"
                size="sm"
                onClick={rightElement.onClick}
                tabIndex={-1}
              >
                <Icon as={rightElement.icon} color={rightElement.color ?? 'gray.400'} />
              </IconButton>
            </InputRightElement>
          </InputGroup>
        ) : (
          <Input
            autoFocus={autoFocus}
            isDisabled={isDisabled}
            variant="filled"
            type={type}
            value={value}
            onChange={onChange}
          />
        )}

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </GridItem>
  );
}
