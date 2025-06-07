import { useEffect, useState } from 'react';
import * as Belt from '@mobily/ts-belt';
import { z } from 'zod';
import { SortField, SortFieldSchema } from '@/types';
import { useDebounce } from './useDebounce';

export function usePageField(searchParamsPage: string | null) {
  const initialPage = Belt.pipe(
    Belt.O.fromNullable(searchParamsPage),
    Belt.O.fromPredicate((value) => !isNaN(Number(value))),
    Belt.O.map((value) => Number(value))
  );

  const [page, setPage] = useState<Belt.Option<number>>(initialPage);

  return { page, setPage };
}

export function useSearchField(searchQuery: string | null) {
  const initialSearchTerm = Belt.pipe(
    Belt.O.fromNullable(searchQuery),
    Belt.O.map((value) => value.trim())
  );

  const [searchTerm, setSearchTerm] =
    useState<Belt.Option<string>>(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
}

export function useSortField(searchParamsSortValue: string | null) {
  const initialSortValue = Belt.pipe(
    Belt.O.fromNullable(searchParamsSortValue),
    Belt.O.map((value) => value.trim()),
    Belt.O.flatMap((value) =>
      Belt.O.fromNullable(SortFieldSchema.safeParse(value).data)
    )
  );

  const [sortField, setSortField] =
    useState<Belt.Option<SortField>>(initialSortValue);

  return { sortField, setSortField };
}

export function useSelectedGenre(
  genres: string[] | undefined,
  searchParamsGenre: string | null
) {
  const initialSelectedGenre = Belt.pipe(
    Belt.O.fromNullable(searchParamsGenre),
    Belt.O.map((value) => value.trim()),
    Belt.O.flatMap((value) =>
      Belt.O.fromNullable(genres)
        ? Belt.O.fromNullable(
            z.enum(genres as [string, ...string[]]).safeParse(value).data
          )
        : value
    )
  );

  const [selectedGenre, setSelectedGenre] =
    useState<Belt.Option<string>>(initialSelectedGenre);

  useEffect(() => {
    setSelectedGenre(initialSelectedGenre);
  }, [initialSelectedGenre]);

  return { selectedGenre, setSelectedGenre };
}
