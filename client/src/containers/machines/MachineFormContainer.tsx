import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader, SuspenseSpinner } from '../../components';
import { Button, Container, Flex, useToast } from '@chakra-ui/react';
import { appRoutes } from '../../routes';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';
import { gql } from '../../__generated__';
import { ApolloError, useMutation, useSuspenseQuery } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';
import MachineFormContainerBasicInfo, {
  type MachineFormContainerBasicInfoHandler,
} from './MachineFormContainerBasicInfo';
import MachineFormContainerElements, {
  type MachineFormContainerElementsHandler,
} from './MachineFormContainerElements';
import { Machine } from '../../__generated__/graphql';

export default function MachineFormContainer(): JSX.Element {
  const { machineId } = useParams<{ machineId: string }>();
  const isEditing = Boolean(machineId);

  return (
    <>
      <PageHeader title={`${isEditing ? 'Editar' : 'Nueva'} máquina`} />

      <Button
        as={Link}
        to={appRoutes.machines.index}
        colorScheme="orange"
        leftIcon={<MdOutlineArrowCircleLeft />}
      >
        Volver
      </Button>

      <SuspenseSpinner>
        <MachineFormContent machineId={machineId} />
      </SuspenseSpinner>
    </>
  );
}

MachineFormContent.gql = {
  queries: {
    machine: gql(`
      query MachineFormContentMachineQuery ($machineId: ID!) {
        machine (machineId: $machineId) {
          id
          name
          code
          elements {
            id
            quantity
            element {
              ... on Material {
                id
                code
                name
                measureUnit
              }
              ... on Part {
                id
                code
                name
              }
            }
          }
        }
      }
    `),
  },

  mutations: {
    createMachine: gql(`
      mutation MachineFormContentCreateMachineMutation ($input: SaveMachineInput!) {
        createMachine (input: $input) {
          id
        }
      }
    `),

    updateMachine: gql(`
      mutation MachineFormContentUpdateMachineMutation ($machineId: ID!, $input: SaveMachineInput!) {
        updateMachine (machineId: $machineId, input: $input) {
          id
        }
      }
    `),
  },
};

type MachineFormContentProps = {
  machineId?: string;
};

type FormHandlers = {
  basicInfo: MachineFormContainerBasicInfoHandler | null;
  elements: MachineFormContainerElementsHandler | null;
};

function MachineFormContent({ machineId }: MachineFormContentProps): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();

  const { data: machineData } = useSuspenseQuery(MachineFormContent.gql.queries.machine, {
    variables: { machineId: String(machineId) },
    skip: !machineId,
    fetchPolicy: 'network-only',
  });

  const handlers = useRef<FormHandlers>({ basicInfo: null, elements: null });

  const [showCodeTakenError, setShowCodeTakenError] = useState(false);

  const [createMachineMutation, createMachineMutationStatus] = useMutation(
    MachineFormContent.gql.mutations.createMachine
  );

  const [updateMachineMutation, updateMachineMutationStatus] = useMutation(
    MachineFormContent.gql.mutations.updateMachine
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const basicInfo = handlers.current.basicInfo?.();
      const elements = handlers.current.elements?.();

      if (basicInfo && elements) {
        setShowCodeTakenError(false);

        try {
          if (machineId) {
            await updateMachineMutation({
              variables: { machineId, input: { ...basicInfo, elements } },
            });
            toast({ description: 'Máquina actualizada exitosamente.' });
          } else {
            await createMachineMutation({ variables: { input: { ...basicInfo, elements } } });
            toast({ description: 'Nueva máquina registrada exitosamente.' });
          }

          navigate(appRoutes.machines.index);
        } catch (error) {
          if ((error as ApolloError)?.message) {
            setShowCodeTakenError(true);
          } else {
            throw new Error();
          }
        }
      }
    },
    [createMachineMutation, updateMachineMutation, toast, navigate, machineId]
  );

  return (
    <>
      <Container
        maxW="container.lg"
        mt="8"
        as="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <MachineFormContainerBasicInfo
          machine={machineData?.machine as Machine}
          showCodeTakenError={showCodeTakenError}
          ref={e => {
            if (e) {
              handlers.current.basicInfo = e;
            }
          }}
        />

        <MachineFormContainerElements
          mt="5"
          machine={machineData?.machine as Machine}
          ref={e => {
            if (e) {
              handlers.current.elements = e;
            }
          }}
        />

        <Flex mt="5" justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="orange"
            isLoading={createMachineMutationStatus.loading || updateMachineMutationStatus.loading}
          >
            Guardar
          </Button>
        </Flex>
      </Container>
    </>
  );
}
