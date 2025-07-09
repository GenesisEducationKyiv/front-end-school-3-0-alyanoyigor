import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGenres } from '@/features/tracks/service.hooks';
import {
  usePageField,
  useSearchField,
  useSelectedGenre,
  useSortField,
} from '@/features/tracks/hooks/useTrackFields';

import { GenreFilter } from '@/features/tracks/filters/GenreFilter';
import { SearchTrack } from '@/features/tracks/filters/SearchTrack';
import { SortTrack } from '@/features/tracks/filters/SortTrack';
import { TrackList } from '@/features/tracks/components/TrackList';

export function TrackListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: genres, isPending: isGenresPending } = useGenres();

  const { page, setPage } = usePageField(searchParams.get('page'));
  const { sortField, setSortField } = useSortField(searchParams.get('sort'));
  const { selectedGenre, setSelectedGenre } = useSelectedGenre(
    genres,
    searchParams.get('genre')
  );
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearchField(
    searchParams.get('search')
  );

  // Change the search params when the page, sort field, search term, or selected genre changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (page && page > 1) params.page = page.toString();
    if (sortField) params.sort = sortField;
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (selectedGenre) params.genre = selectedGenre;

    setSearchParams(params);
  }, [page, sortField, debouncedSearchTerm, selectedGenre]);

  // Reset the page to 1 when the search term, selected genre, or sort field changes
  useEffect(() => {
    if (page && page > 1) {
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
