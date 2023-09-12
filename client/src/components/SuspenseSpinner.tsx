import { Flex, Spinner } from '@chakra-ui/react';
import { ReactNode, Suspense } from 'react';

type Props = {
  children?: ReactNode;
};

export default function SuspenseSpinner({ children }: Props): JSX.Element {
  return (
    <Suspense
      fallback={
        <Flex justifyContent="center" my="4">
          <Spinner
            color="orange.500"
            emptyColor="gray.200"
            size="lg"
            speed="0.65s"
            thickness="3px"
          />
        </Flex>
      }
    >
      {children}
    </Suspense>
  );
}
