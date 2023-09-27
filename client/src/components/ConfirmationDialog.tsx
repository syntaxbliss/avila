import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureProps,
} from '@chakra-ui/react';
import { useRef } from 'react';

type Props = {
  children?: React.ReactNode;
  confirmButtonColorScheme: React.ComponentProps<typeof Button>['colorScheme'];
  confirmButtonDisabled?: React.ComponentProps<typeof Button>['isDisabled'];
  confirmButtonIcon: React.ComponentProps<typeof Button>['leftIcon'];
  confirmButtonText: string;
  isLoading?: boolean;
  isOpen: NonNullable<UseDisclosureProps['isOpen']>;
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  onConfirm: () => void;
  size?: React.ComponentProps<typeof AlertDialog>['size'];
  title: string;
};

export default function ConfirmationDialog({
  children,
  confirmButtonColorScheme,
  confirmButtonDisabled,
  confirmButtonIcon,
  confirmButtonText,
  isLoading,
  isOpen,
  onClose,
  onConfirm,
  size = 'md',
  title,
}: Props): JSX.Element {
  const dialogCancelRef = useRef(null);

  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={dialogCancelRef}
      onClose={onClose}
      size={size}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{children}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={dialogCancelRef} onClick={onClose} isDisabled={isLoading}>
              Cancelar
            </Button>

            <Button
              colorScheme={confirmButtonColorScheme}
              isDisabled={isLoading || confirmButtonDisabled}
              isLoading={isLoading}
              leftIcon={confirmButtonIcon}
              ml="3"
              onClick={onConfirm}
            >
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
