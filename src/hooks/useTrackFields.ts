import { useState } from "react";
import { z } from "zod";
import { SortField, SortFieldSchema } from "@/types";

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
  let initialSelectedGenre: string | null = null;

  if (genres && genres.length > 0) {
    const selectedGenresQuery = z
      .enum(genres as [string, ...string[]])
      .safeParse(searchParamsGenre);
    if (selectedGenresQuery.success) {
      initialSelectedGenre = selectedGenresQuery.data;
    }
  }

  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    initialSelectedGenre
  );

  return { selectedGenre, setSelectedGenre };
}
