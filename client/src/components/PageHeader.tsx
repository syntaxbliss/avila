import { Divider, Flex, Heading } from '@chakra-ui/react';
import { memo } from 'react';

type Props = {
  title: string;
};

function PageHeader({ title }: Props): JSX.Element {
  return (
    <>
      <Flex>
        <Heading size="lg">{title}</Heading>
      </Flex>

      <Divider borderColor="gray.300" mb="5" />
    </>
  );
}

export default memo(PageHeader);
