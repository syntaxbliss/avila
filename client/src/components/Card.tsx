import { Divider, Flex, Heading } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof Flex> & {
  children?: React.ReactNode;
  title?: string;
};

export default function Card({ children, title, ...rest }: Props): JSX.Element {
  return (
    <Flex
      direction="column"
      borderWidth="1px"
      bg="white"
      m="auto"
      px="8"
      py="5"
      w="full"
      rounded="md"
      {...rest}
    >
      {title && (
        <>
          <Heading size="md">{title}</Heading>

          <Divider mt="2" mb="5" />
        </>
      )}

      {children}
    </Flex>
  );
}
