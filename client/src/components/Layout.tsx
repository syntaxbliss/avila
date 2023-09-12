import { Button, Divider, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import { MdOutlineAllInbox, MdOutlineDashboard } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { appRoutes } from '../routes';

type Props = {
  children?: React.ReactNode;
};

const sections = [
  { path: appRoutes.dashboard.index, icon: MdOutlineDashboard, text: 'Escritorio' },
  { path: appRoutes.materials.index, icon: MdOutlineAllInbox, text: 'Materiales' },
];

export default function Layout({ children }: Props): JSX.Element {
  return (
    <Grid gridTemplateColumns="180px 1fr" h="100vh" w="full">
      <GridItem>
        <Sidebar />
      </GridItem>

      <GridItem bg="gray.100" px="5" py="4">
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
