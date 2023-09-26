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
  confirmButtonIcon: React.ComponentProps<typeof Button>['leftIcon'];
  confirmButtonText: string;
  isLoading?: boolean;
  isOpen: NonNullable<UseDisclosureProps['isOpen']>;
  onClose: NonNullable<UseDisclosureProps['onClose']>;
  onConfirm: () => void;
  title: string;
};

export default function ConfirmationDialog({
  children,
  confirmButtonColorScheme,
  confirmButtonIcon,
  confirmButtonText,
  isLoading,
  isOpen,
  onClose,
  onConfirm,
  title,
}: Props): JSX.Element {
  const dialogCancelRef = useRef(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={dialogCancelRef} onClose={onClose} isCentered>
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
              onClick={onConfirm}
              isLoading={isLoading}
              ml="3"
              leftIcon={confirmButtonIcon}
            >
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
