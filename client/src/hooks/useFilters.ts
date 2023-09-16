import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_DEBOUNCE_INTERVAL = 300;

export default function useFilters<T extends {}>(
  defaultValues: T,
  values: T,
  interval: number = DEFAULT_DEBOUNCE_INTERVAL
) {
  const [searchParams, setSearchParams] = useState<T>({ ...defaultValues });

  const debouncedSearch = useRef(
    _.debounce((params: T) => {
      setSearchParams({ ...params });
    }, interval)
  ).current;

  useEffect(() => {
    debouncedSearch(values);

    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, values]);

  return searchParams;
}
