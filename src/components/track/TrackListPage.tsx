import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from '@/hooks/useDebounce';
import { useGenres } from '@/services/hooks';
import { useSelectedGenre, useSortField } from '@/hooks/useTrackFields';

import { GenreFilter } from '../filters/GenreFilter';
import { SearchTrack } from '../filters/SearchTrack';
import { SortTrack } from '../filters/SortTrack';
import { TrackList } from './TrackList';

export function TrackListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);

  const { data: genres, isPending: isGenresPending } = useGenres();

  const { sortField, setSortField } = useSortField(searchParams.get('sort'));
  const searchParamsGenre = useRef<string | null>(searchParams.get('genre'));
  const { selectedGenre, setSelectedGenre } = useSelectedGenre(
    genres,
    searchParamsGenre.current
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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
        genres={genres}
      />
    </div>
  );
}
