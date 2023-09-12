import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import theme from './theme';
import AppContainer from './containers/AppContainer';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_URL,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={theme}>
        <AppContainer />
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode>
);
