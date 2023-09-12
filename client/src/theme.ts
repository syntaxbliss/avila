import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  components: {
    FormLabel: {
      baseStyle: {
        fontWeight: 'bold',
        fontSize: 'sm',
        color: 'gray.600',
        mb: '1',
      },
    },
  },
});

export default theme;
