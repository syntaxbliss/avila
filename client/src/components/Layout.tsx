import { Button, Divider, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import {
  MdLocalShipping,
  MdOutlineListAlt,
  MdOutlineShoppingCart,
  MdShelves,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { appRoutes } from '../routes';

type Props = {
  children?: React.ReactNode;
};

const sections = [
  { path: appRoutes.materials.index, icon: MdShelves, text: 'Materiales' },
  { path: appRoutes.suppliers.index, icon: MdLocalShipping, text: 'Proveedores' },
  {
    path: appRoutes.requestsForQuotation.index,
    icon: MdOutlineListAlt,
    text: 'Pedidos de cotización',
  },
  { path: appRoutes.purchaseOrders.index, icon: MdOutlineShoppingCart, text: 'Órdenes de compra' },
];

export default function Layout({ children }: Props): JSX.Element {
  return (
    <Grid gridTemplateColumns="230px 1fr" h="100vh" w="full">
      <GridItem>
        <Sidebar />
      </GridItem>

      <GridItem bg="gray.100" px="5" py="4" maxH="100%" overflow="auto">
        {children}
      </GridItem>
    </Grid>
  );
}

function Sidebar(): JSX.Element {
  return (
    <Flex h="full" w="full" flexDir="column" bgColor="gray.800">
      {sections.map(section => (
        <Fragment key={section.path}>
          <Button
            as={Link}
            to={section.path}
            variant="ghost"
            colorScheme="whiteAlpha"
            w="full"
            rounded="0"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            px="3"
            py="6"
          >
            <Icon as={section.icon} w={6} h={6} color="white" opacity={0.7} />
            <Text textTransform="uppercase" fontSize="xs" ml="3">
              {section.text}
            </Text>
          </Button>

          <Divider opacity={0.3} />
        </Fragment>
      ))}
    </Flex>
  );
}
