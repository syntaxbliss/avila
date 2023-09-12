import { Button, Divider, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import { MdOutlineAllInbox, MdOutlineDashboard } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { RouteURL } from '../types';
import { Fragment } from 'react';

type Props = {
  children?: React.ReactNode;
};

const sections = [
  { path: RouteURL.DASHBOARD, icon: MdOutlineDashboard, text: 'Escritorio' },
  { path: RouteURL.MATERIALS, icon: MdOutlineAllInbox, text: 'Materiales' },
];

export default function Layout({ children }: Props): JSX.Element {
  return (
    <Grid gridTemplateColumns="180px 1fr" h="100vh" w="full">
      <GridItem>
        <Sidebar />
      </GridItem>

      <GridItem bg="gray.100" p="3">
        {children}
      </GridItem>
    </Grid>
  );
}

function Sidebar(): JSX.Element {
  return (
    <Flex h="full" w="full" flexDir="column" bgColor="purple.900">
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
