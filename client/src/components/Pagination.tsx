import { Flex, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { PaginationInfo, PaginationInput } from '../__generated__/graphql';
import { useMemo } from 'react';

const PAGES_DELTA = 3;

type Props = PaginationInfo & {
  onChange: (pagination: PaginationInput) => void;
};

export default function Pagination({ count, onChange, pageNumber, pageSize }: Props): JSX.Element {
  const totalPages = useMemo(() => {
    return Math.ceil(count / pageSize);
  }, [count, pageSize]);

  const hasNextPage = useMemo(() => {
    return pageNumber + 1 <= totalPages;
  }, [pageNumber, totalPages]);

  const pageNumbers = useMemo(() => {
    return Array.from(
      { length: PAGES_DELTA * 2 + 1 },
      (_, i) => pageNumber - (PAGES_DELTA - i)
    ).filter(i => i >= 1 && i <= totalPages);
  }, [pageNumber, totalPages]);

  return (
    <Flex w="full" justify="space-between" align="center">
      <Text
        fontSize="xs"
        color="gray.600"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {count} resultado{count > 1 ? 's' : null} | Página {pageNumber} de {totalPages}
      </Text>

      <Flex align="center">
        <Text
          fontSize="xs"
          color="gray.600"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Resultados por página:
        </Text>

        <Select
          size="xs"
          variant="filled"
          value={pageSize}
          onChange={e => onChange({ pageNumber: 1, pageSize: Number(e.target.value) })}
          ml="1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </Select>
      </Flex>

      <HStack gap="1">
        <IconButton
          aria-label="first-page"
          icon={<MdKeyboardDoubleArrowLeft />}
          onClick={() => onChange({ pageSize, pageNumber: 1 })}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={pageNumber === 1}
        />

        <IconButton
          aria-label="previous-page"
          icon={<MdKeyboardArrowLeft />}
          onClick={() => onChange({ pageSize, pageNumber: pageNumber - 1 })}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={pageNumber === 1}
        />

        {pageNumbers.map(pn => (
          <IconButton
            key={`page-${pn}`}
            aria-label={`page-${pn}`}
            icon={<Text fontWeight="normal">{pn}</Text>}
            onClick={() => onChange({ pageSize, pageNumber: pn })}
            rounded="full"
            size="xs"
            colorScheme="orange"
            isDisabled={pageNumber === pn}
          />
        ))}

        <IconButton
          aria-label="next-page"
          icon={<MdKeyboardArrowRight />}
          onClick={() => onChange({ pageSize, pageNumber: pageNumber + 1 })}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={!hasNextPage}
        />

        <IconButton
          aria-label="last-page"
          icon={<MdKeyboardDoubleArrowRight />}
          onClick={() => onChange({ pageSize, pageNumber: totalPages })}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={!hasNextPage}
        />
      </HStack>
    </Flex>
  );
}
