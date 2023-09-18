import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PaginationInput } from '../__generated__/graphql';
import _ from 'lodash';

const DEFAULT_DEBOUNCE_DELAY = 500;

const defaultPagination: PaginationInput = {
  pageNumber: 1,
  pageSize: 10,
};

type FilteredAndPaginatedQueryInput<T> = {
  searchParams: T;
  pagination: PaginationInput;
};

export default function useQueryFilteringAndPagination<T extends {}>(
  filters: T,
  interval: number = DEFAULT_DEBOUNCE_DELAY
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const defaultSearchParams = useRef(filters);
  const [searchParams, setSearchParams] = useState<T>(filters);
  const [queryVariables, setQueryVariables] = useState<FilteredAndPaginatedQueryInput<T>>({
    searchParams,
    pagination: { ...defaultPagination },
  });

  const debouncedSearchParamsChange = useCallback(
    (partialUpdate: Partial<T>) => {
      clearTimeout(timeout.current);

      setSearchParams(params => ({ ...params, ...partialUpdate }));

      timeout.current = setTimeout(() => {
        setQueryVariables(qv => ({
          pagination: { ...defaultPagination },
          searchParams: { ...qv.searchParams, ...partialUpdate },
        }));
      }, interval);
    },
    [interval]
  );

  const immediateSearchParamsChange = useCallback((partialUpdate: Partial<T>) => {
    clearTimeout(timeout.current);

    setSearchParams(params => ({ ...params, ...partialUpdate }));
    setQueryVariables(qv => ({
      pagination: { ...defaultPagination },
      searchParams: { ...qv.searchParams, ...partialUpdate },
    }));
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  const onPaginationChange = useCallback((partialUpdate: Partial<PaginationInput>) => {
    clearTimeout(timeout.current);
    setQueryVariables(qv => ({ ...qv, pagination: { ...qv.pagination, ...partialUpdate } }));
  }, []);

  const onResetFilters = useMemo(() => {
    if (_.isEqual(defaultSearchParams.current, searchParams)) {
      return undefined;
    }

    return () => immediateSearchParamsChange(defaultSearchParams.current);
  }, [searchParams, immediateSearchParamsChange]);

  return {
    onDebouncedSearchParamsChange: debouncedSearchParamsChange,
    onImmediateSearchParamsChange: immediateSearchParamsChange,
    onPaginationChange,
    onResetFilters,
    queryVariables,
    searchParams,
  };
}
