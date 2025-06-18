import { useEffect, useState } from 'react';
import { pipe, O, Option } from '@mobily/ts-belt';
import { z } from 'zod';
import { SortField, SortFieldSchema } from '@/types';
import { useDebounce } from './useDebounce';

export function usePageField(searchParamsPage: string | null) {
  const initialPage = pipe(
    O.fromNullable(searchParamsPage),
    O.fromPredicate((value) => !isNaN(Number(value))),
    O.map((value) => Number(value))
  );

  const [page, setPage] = useState<Option<number>>(initialPage);

  return { page, setPage };
}

export function useSearchField(searchQuery: string | null) {
  const initialSearchTerm = pipe(
    O.fromNullable(searchQuery),
    O.map((value) => value.trim())
  );

  const [searchTerm, setSearchTerm] =
    useState<Option<string>>(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
}

export function useSortField(searchParamsSortValue: string | null) {
  const initialSortValue = pipe(
    O.fromNullable(searchParamsSortValue),
    O.map((value) => value.trim()),
    O.flatMap((value) => O.fromNullable(SortFieldSchema.safeParse(value).data))
  );

  const [sortField, setSortField] =
    useState<Option<SortField>>(initialSortValue);

  return { sortField, setSortField };
}

export function useSelectedGenre(
  genres: string[] | undefined,
  searchParamsGenre: string | null
) {
  const initialSelectedGenre = pipe(
    O.fromNullable(searchParamsGenre),
    O.map((value) => value.trim()),
    O.flatMap((value) =>
      O.fromNullable(genres)
        ? O.fromNullable(
            z.enum(genres as [string, ...string[]]).safeParse(value).data
          )
        : value
    )
  );

  const [selectedGenre, setSelectedGenre] =
    useState<Option<string>>(initialSelectedGenre);

  useEffect(() => {
    setSelectedGenre(initialSelectedGenre);
  }, [initialSelectedGenre]);

  return { selectedGenre, setSelectedGenre };
}
