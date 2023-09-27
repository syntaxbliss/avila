import { MdCheck } from 'react-icons/md';
import { ConfirmationDialog, FormInputNumber } from '../../components';
import { Material } from '../../__generated__/graphql';
import { Container, Flex, Text, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { validationRules } from '../../validation/rules';
import { z } from 'zod';
import { materialMeasureUnitAbbreviationByMaterialMeasureUnit } from '../../helpers';
import { gql } from '../../__generated__';
import { useMutation } from '@apollo/client';

MaterialsContainerUpdateStockForm.gql = {
  mutations: {
    updateQuantity: gql(`
      mutation MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutation ($input: UpdateMaterialQuantityInput!) {
        updateMaterialQuantity (input: $input)
      }
    `),
  },
};

type Props = {
  isOpen: React.ComponentProps<typeof ConfirmationDialog>['isOpen'];
  material?: Material;
  onClose: React.ComponentProps<typeof ConfirmationDialog>['onClose'];
  onConfirm: React.ComponentProps<typeof ConfirmationDialog>['onConfirm'];
};

const formSchema = z.object({ quantity: validationRules.decimal(0, 99999999.99) });

export default function MaterialsContainerUpdateStockForm({
  isOpen,
  material,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const toast = useToast();

  const [quantity, setQuantity] = useState(String(material?.currentQuantity || 0));

  const [updateMaterialQuantityMutation, updateMaterialQuantityMutationStatus] = useMutation(
    MaterialsContainerUpdateStockForm.gql.mutations.updateQuantity
  );

  const validatedForm = useMemo(() => {
    return formSchema.safeParse({ quantity });
  }, [quantity]);

  const shouldDisableAcceptButton = useMemo(() => {
    if (String(material?.currentQuantity) === String(quantity)) {
      return true;
    }

    return !validatedForm.success;
  }, [material?.currentQuantity, quantity, validatedForm]);

  const handleAcceptClick = useCallback(() => {
    if (material?.id && validatedForm.success) {
      updateMaterialQuantityMutation({
        variables: {
          input: {
            materialId: material.id,
            quantity: validatedForm.data.quantity as number,
          },
        },
        onCompleted() {
          toast({ description: 'Material actualizado exitosamente.' });
          onConfirm();
        },
      });
    }
  }, [material?.id, updateMaterialQuantityMutation, validatedForm, toast, onConfirm]);

  useEffect(() => {
    setQuantity(String(material?.currentQuantity || 0));
  }, [material?.currentQuantity]);

  return (
    <ConfirmationDialog
      confirmButtonColorScheme="green"
      confirmButtonDisabled={shouldDisableAcceptButton}
      confirmButtonIcon={<MdCheck />}
      confirmButtonText="Aceptar"
      isLoading={updateMaterialQuantityMutationStatus.loading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleAcceptClick}
      size="xl"
      title="Actualizar existencias"
    >
      {material && (
        <>
          <Text>
            Ingrese la cantidad actual de{' '}
            <b>
              [{material.code}] {material.name}
            </b>
            :
          </Text>

          <Container maxW="xs" mt="8">
            <Flex>
              <FormInputNumber value={quantity} onChange={e => setQuantity(e)} />

              <Text ml="2" mt="2">
                {materialMeasureUnitAbbreviationByMaterialMeasureUnit[material.measureUnit]}
              </Text>
            </Flex>
          </Container>
        </>
      )}
    </ConfirmationDialog>
  );
}
