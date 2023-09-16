import { Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { PaginationInfo } from '../__generated__/graphql';
import { useMemo } from 'react';

const PAGES_DELTA = 3;

type Props = PaginationInfo & {
  onPageNumberChange: (pageNumber: number) => void;
};

export default function Pagination({
  count,
  onPageNumberChange,
  pageNumber,
  pageSize,
}: Props): JSX.Element {
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

      <HStack gap="1">
        <IconButton
          aria-label="first-page"
          icon={<MdKeyboardDoubleArrowLeft />}
          onClick={() => onPageNumberChange(1)}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={pageNumber === 1}
        />

        <IconButton
          aria-label="previous-page"
          icon={<MdKeyboardArrowLeft />}
          onClick={() => onPageNumberChange(pageNumber - 1)}
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
            onClick={() => onPageNumberChange(pn)}
            rounded="full"
            size="xs"
            colorScheme="orange"
            isDisabled={pageNumber === pn}
          />
        ))}

        <IconButton
          aria-label="next-page"
          icon={<MdKeyboardArrowRight />}
          onClick={() => onPageNumberChange(pageNumber + 1)}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={!hasNextPage}
        />

        <IconButton
          aria-label="last-page"
          icon={<MdKeyboardDoubleArrowRight />}
          onClick={() => onPageNumberChange(totalPages)}
          rounded="full"
          size="xs"
          colorScheme="orange"
          isDisabled={!hasNextPage}
        />
      </HStack>
    </Flex>
  );
}
