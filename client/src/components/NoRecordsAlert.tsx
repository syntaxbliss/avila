import { Alert, AlertIcon } from '@chakra-ui/react';
import { memo } from 'react';

type Props = {
  entity: string;
};

function NoRecordsAlert({ entity }: Props): JSX.Element {
  return (
    <Alert status="info">
      <AlertIcon />
      No se encontraron registros de {entity}.
    </Alert>
  );
}

export default memo(NoRecordsAlert);
