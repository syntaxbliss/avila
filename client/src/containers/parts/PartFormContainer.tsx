import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components';
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
import { ApolloError, useMutation } from '@apollo/client';

PartFormContainer.gql = {
  mutations: {
    createPart: gql(`
      mutation PartFormContainerCreatePartMutation ($input: CreatePartInput!) {
        createPart (input: $input) {
          id
        }
      }
    `),
  },
};

type FormHandlers = {
  basicInfo: PartFormContainerBasicInfoBasicInfoHandler | null;
  materials: PartFormContainerMaterialsHandler | null;
};

export default function PartFormContainer(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();

  const { partId } = useParams<{ partId: string }>();
  const isEditing = Boolean(partId);
  const handlers = useRef<FormHandlers>({ basicInfo: null, materials: null });

  const [showCodeTakenError, setShowCodeTakenError] = useState(false);

  const [createPartMutation, createPartMutationStatus] = useMutation(
    PartFormContainer.gql.mutations.createPart
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
          await createPartMutation({ variables: { input: { ...basicInfo, materials } } });

          toast({ description: 'Nueva parte registrada exitosamente.' });
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
    [createPartMutation, toast, navigate]
  );

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

      <Container
        maxW="container.lg"
        mt="8"
        as="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <PartFormContainerBasicInfoBasicInfo
          showCodeTakenError={showCodeTakenError}
          ref={e => {
            if (e) {
              handlers.current.basicInfo = e;
            }
          }}
        />

        <PartFormContainerMaterials
          mt="5"
          ref={e => {
            if (e) {
              handlers.current.materials = e;
            }
          }}
        />

        <Flex mt="5" justifyContent="flex-end">
          <Button type="submit" colorScheme="orange" isLoading={createPartMutationStatus.loading}>
            Guardar
          </Button>
        </Flex>
      </Container>
    </>
  );
}
