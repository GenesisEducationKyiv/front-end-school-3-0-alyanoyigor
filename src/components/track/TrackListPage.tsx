import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useDebounce } from '@/hooks/useDebounce';
import { useGenres } from '@/services/hooks';
import { SortField } from '@/types';
import { sortFieldOptions } from '@/consts';

import { GenreFilter } from '../GenreFilter';
import { SearchTrack } from '../SearchTrack';
import { SortTrack } from '../SortTrack';
import { TrackList } from './TrackList';

const SortFieldSchema = z.enum(
  Object.keys(sortFieldOptions) as [string, ...string[]]
);

export function TrackListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);

  const { data: genres, isPending: isGenresPending } = useGenres();

  const sortValueQuery = SortFieldSchema.safeParse(searchParams.get('sort'));
  const selectedGenresQuery = genres
    ? z
        .enum(genres as [string, ...string[]])
        .safeParse(searchParams.get('genre'))
    : { success: false, data: '' };

  const [sortField, setSortField] = useState<SortField | null>(
    sortValueQuery.success ? (sortValueQuery.data as SortField) : null
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    selectedGenresQuery.success && selectedGenresQuery.data
      ? selectedGenresQuery.data
      : null
  );

  // Change the search params when the page, sort field, search term, or selected genre changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = page.toString();
    if (sortField) params.sort = sortField;
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (selectedGenre) params.genre = selectedGenre;

    setSearchParams(params);
  }, [page, sortField, debouncedSearchTerm, selectedGenre]);

  // Reset the page to 1 when the search term, selected genre, or sort field changes
  useEffect(() => {
    if (page !== initialPage && page > 1) {
      setPage(1);
    }
  }, [debouncedSearchTerm, selectedGenre, sortField]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <SearchTrack searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex items-center gap-2">
          <SortTrack sortField={sortField} setSortField={setSortField} />
        </div>
      </div>

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onSelect={setSelectedGenre}
        isGenresPending={isGenresPending}
      />

      <TrackList
        page={page}
        setPage={setPage}
        sortField={sortField}
        debouncedSearchTerm={debouncedSearchTerm}
        selectedGenre={selectedGenre}
        genres={genres || []}
      />
    </div>
  );
}
