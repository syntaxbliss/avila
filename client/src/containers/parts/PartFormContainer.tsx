import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader, SuspenseSpinner } from '../../components';
import { Button, Container, Flex, useToast } from '@chakra-ui/react';
import { appRoutes } from '../../routes';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';
import { useCallback, useRef, useState } from 'react';
import PartFormContainerBasicInfoBasicInfo, {
  type PartFormContainerBasicInfoBasicInfoHandler,
} from './PartFormContainerBasicInfo';
import PartFormContainerMaterials, {
  type PartFormContainerMaterialsHandler,
} from './PartFormContainerMaterials';
import { gql } from '../../__generated__';
import { ApolloError, useMutation, useSuspenseQuery } from '@apollo/client';
import { Part } from '../../__generated__/graphql';

export default function PartFormContainer(): JSX.Element {
  const { partId } = useParams<{ partId: string }>();
  const isEditing = Boolean(partId);

  return (
    <>
      <PageHeader title={`${isEditing ? 'Editar' : 'Nueva'} parte`} />

      <Button
        as={Link}
        to={appRoutes.parts.index}
        colorScheme="orange"
        leftIcon={<MdOutlineArrowCircleLeft />}
      >
        Volver
      </Button>

      <SuspenseSpinner>
        <PartFormContent partId={partId} />
      </SuspenseSpinner>
    </>
  );
}

PartFormContent.gql = {
  queries: {
    part: gql(`
      query PartFormContentPartQuery ($partId: ID!) {
        part (partId: $partId) {
          id
          name
          code
          materials {
            material {
              id
            }
            quantity
          }
        }
      }
    `),
  },

  mutations: {
    createPart: gql(`
      mutation PartFormContentCreatePartMutation ($input: SavePartInput!) {
        createPart (input: $input) {
          id
        }
      }
    `),

    updatePart: gql(`
      mutation PartFormContentUpdatePartMutation ($partId: ID!, $input: SavePartInput!) {
        updatePart (partId: $partId, input: $input) {
          id
        }
      }
    `),
  },
};

type PartFormContentProps = {
  partId?: string;
};

type FormHandlers = {
  basicInfo: PartFormContainerBasicInfoBasicInfoHandler | null;
  materials: PartFormContainerMaterialsHandler | null;
};

function PartFormContent({ partId }: PartFormContentProps): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();

  const { data: partData } = useSuspenseQuery(PartFormContent.gql.queries.part, {
    variables: { partId: String(partId) },
    skip: !partId,
    fetchPolicy: 'network-only',
  });

  const handlers = useRef<FormHandlers>({ basicInfo: null, materials: null });

  const [showCodeTakenError, setShowCodeTakenError] = useState(false);

  const [createPartMutation, createPartMutationStatus] = useMutation(
    PartFormContent.gql.mutations.createPart
  );

  const [updatePartMutation, updatePartMutationStatus] = useMutation(
    PartFormContent.gql.mutations.updatePart
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const basicInfo = handlers.current.basicInfo?.();
      const materials = handlers.current.materials?.();

      if (basicInfo && materials) {
        setShowCodeTakenError(false);

        try {
          if (partId) {
            await updatePartMutation({ variables: { partId, input: { ...basicInfo, materials } } });
            toast({ description: 'Parte actualizada exitosamente.' });
          } else {
            await createPartMutation({ variables: { input: { ...basicInfo, materials } } });
            toast({ description: 'Nueva parte registrada exitosamente.' });
          }

          navigate(appRoutes.parts.index);
        } catch (error) {
          if ((error as ApolloError).message === 'CODE_TAKEN') {
            setShowCodeTakenError(true);
          } else {
            throw new Error();
          }
        }
      }
    },
    [createPartMutation, updatePartMutation, toast, navigate, partId]
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
        <PartFormContainerBasicInfoBasicInfo
          part={partData?.part as Part}
          showCodeTakenError={showCodeTakenError}
          ref={e => {
            if (e) {
              handlers.current.basicInfo = e;
            }
          }}
        />

        <PartFormContainerMaterials
          mt="5"
          part={partData?.part as Part}
          ref={e => {
            if (e) {
              handlers.current.materials = e;
            }
          }}
        />

        <Flex mt="5" justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="orange"
            isLoading={createPartMutationStatus.loading || updatePartMutationStatus.loading}
          >
            Guardar
          </Button>
        </Flex>
      </Container>
    </>
  );
}
