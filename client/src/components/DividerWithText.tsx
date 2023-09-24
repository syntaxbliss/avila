import { Box, Divider, Text } from '@chakra-ui/react';
import { memo } from 'react';

type Props = React.ComponentProps<typeof Box> & {
  text: string;
};

const DividerWithText: React.FC<Props> = ({ text, ...rest }) => {
  return (
    <Box position="relative" {...rest}>
      <Divider />

      <Text
        bgColor="white"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wider"
        fontSize="xs"
        color="gray.500"
        px="2"
      >
        {text}
      </Text>
    </Box>
  );
};

export default memo(DividerWithText);
