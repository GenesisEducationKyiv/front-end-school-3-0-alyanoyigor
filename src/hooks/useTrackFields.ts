import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { SortField, SortFieldSchema } from '@/types';

export function useSortField(searchParamsSortValue: string | null) {
  const sortValidatedData = SortFieldSchema.safeParse(searchParamsSortValue);
  const initialSortValue = sortValidatedData.success
    ? sortValidatedData.data
    : null;

  const [sortField, setSortField] = useState<SortField | null>(
    initialSortValue
  );

  return { sortField, setSortField };
}

export function useSelectedGenre(
  genres: string[] | undefined,
  searchParamsGenre: string | null
) {
  const initialSelectedGenre = useMemo(() => {
    if (genres && genres.length > 0) {
      const selectedGenresQuery = z
        .enum(genres as [string, ...string[]])
        .safeParse(searchParamsGenre);
      if (selectedGenresQuery.success) {
        return selectedGenresQuery.data;
      }
    }

    return null;
  }, [genres, searchParamsGenre]);

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    setSelectedGenre(initialSelectedGenre);
  }, [initialSelectedGenre]);

  return { selectedGenre, setSelectedGenre };
}
