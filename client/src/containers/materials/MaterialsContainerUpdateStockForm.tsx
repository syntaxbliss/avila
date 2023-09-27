import { MdCheck } from 'react-icons/md';
import { ConfirmationDialog, FormInputNumber } from '../../components';
import { MaterialMeasureUnit } from '../../__generated__/graphql';
import { Container, Flex, Text, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { validationRules } from '../../validation/rules';
import { z } from 'zod';
import { materialMeasureUnitAbbreviationByMaterialMeasureUnit } from '../../helpers';
import { gql } from '../../__generated__';
import { useMutation } from '@apollo/client';
import _ from 'lodash';

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
  code?: string;
  currentQuantity?: number;
  isOpen: React.ComponentProps<typeof ConfirmationDialog>['isOpen'];
  materialId?: string;
  measureUnit?: MaterialMeasureUnit;
  name?: string;
  onClose: React.ComponentProps<typeof ConfirmationDialog>['onClose'];
  onConfirm: React.ComponentProps<typeof ConfirmationDialog>['onConfirm'];
};

const formSchema = z.object({ quantity: validationRules.decimal(0, 99999999.99) });

export default function MaterialsContainerUpdateStockForm({
  code,
  currentQuantity,
  isOpen,
  materialId,
  measureUnit,
  name,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const toast = useToast();

  const [quantity, setQuantity] = useState(String(currentQuantity || 0));

  const [updateMaterialQuantityMutation, updateMaterialQuantityMutationStatus] = useMutation(
    MaterialsContainerUpdateStockForm.gql.mutations.updateQuantity
  );

  const validatedForm = useMemo(() => {
    return formSchema.safeParse({ quantity });
  }, [quantity]);

  const shouldDisableAcceptButton = useMemo(() => {
    if (String(currentQuantity) === String(quantity)) {
      return true;
    }

    return !validatedForm.success;
  }, [currentQuantity, quantity, validatedForm]);

  const handleAcceptClick = useCallback(() => {
    if (materialId && validatedForm.success && !_.isUndefined(validatedForm.data.quantity)) {
      updateMaterialQuantityMutation({
        variables: {
          input: {
            materialId,
            quantity: validatedForm.data.quantity,
          },
        },
        onCompleted() {
          toast({ description: 'Material actualizado exitosamente.' });
          onConfirm();
        },
      });
    }
  }, [materialId, updateMaterialQuantityMutation, validatedForm, toast, onConfirm]);

  useEffect(() => {
    setQuantity(String(currentQuantity || 0));
  }, [currentQuantity]);

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
      {materialId && measureUnit && (
        <>
          <Text>
            Ingrese la cantidad actual de{' '}
            <b>
              [{code}] {name}
            </b>
            :
          </Text>

          <Container maxW="xs" mt="8">
            <Flex>
              <FormInputNumber value={quantity} onChange={e => setQuantity(e)} />

              <Text ml="2" mt="2">
                {materialMeasureUnitAbbreviationByMaterialMeasureUnit[measureUnit]}
              </Text>
            </Flex>
          </Container>
        </>
      )}
    </ConfirmationDialog>
  );
}
