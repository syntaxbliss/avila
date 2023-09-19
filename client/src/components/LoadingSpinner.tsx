import { Flex, Spinner } from '@chakra-ui/react';
import { memo } from 'react';

type Props = {
  isVisible?: boolean;
};

function LoadingSpinner({ isVisible }: Props): JSX.Element | null {
  if (isVisible) {
    return (
      <Flex justifyContent="center" my="8">
        <Spinner color="orange.500" emptyColor="gray.200" size="lg" speed="0.65s" thickness="3px" />
      </Flex>
    );
  }

  return null;
}

export default memo(LoadingSpinner);
