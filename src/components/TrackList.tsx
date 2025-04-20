import { SearchIcon, XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useDebounce } from '@/hooks/useDebounce';
import { useGenres, useTracks } from '@/services/hooks';
import { SortField, Track } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { GenreFilter } from './GenreFilter';
import { TrackItem } from './TrackItem';
import { Pagination } from './Pagination';
import { TrackItemSkeleton } from './TrackItemSkeleton';
import { Button } from './ui/button';

const sortFieldOptions = {
  title: 'Title',
  artist: 'Artist',
  album: 'Album',
  createdAt: 'Date Added',
};

const SortFieldSchema = z.enum(Object.keys(sortFieldOptions) as [string, ...string[]]);

export function TrackList() {
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

  // Fetch the tracks
  const {
    data: tracks,
    isPending,
    error,
  } = useTracks(page, {
    ...(sortField && { sort: sortField as SortField }),
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(selectedGenre && { genre: selectedGenre }),
  });

  // Change the search params when the page, sort field, search term, or selected genre changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (page !== 1) params.page = page.toString();
    if (sortField) params.sort = sortField;
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (selectedGenre) params.genre = selectedGenre;

    setSearchParams(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    sortField,
    debouncedSearchTerm,
    selectedGenre,
    initialPage,
  ]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, selectedGenre, sortField]);

  if (isPending) {
    return (
      <div className="mt-8 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <TrackItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-destructive">
        Error loading tracks
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <Label htmlFor="search" className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                setSearchTerm(e.target.value)}
              }
              className="pl-10"
            />
            {searchTerm.length > 0 && (
              <Button
                onClick={() => setSearchTerm('')}
                variant="ghost"
                className="absolute right-0 top-1/2 size-8 -translate-y-1/2"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            )}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {sortField ? (
            <Button
              variant="outline"
              onClick={() => setSortField(null)}
              className="flex justify-between min-w-32 text-muted-foreground"
            >
              {sortFieldOptions[sortField]}
              <XIcon className="h-4 w-4" />
            </Button>
          ) : (
          <Select
            value={sortField || ''}
            onValueChange={(value: SortField) => {
              setSortField(value);
            }}
          >
            <SelectTrigger className="min-w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="artist">Artist</SelectItem>
              <SelectItem value="album">Album</SelectItem>
              <SelectItem value="createdAt">Date Added</SelectItem>
            </SelectContent>
          </Select>
          
          )}
        </div>
      </div>
      <GenreFilter
        genres={genres || []}
        selectedGenre={selectedGenre}
        onSelect={setSelectedGenre}
        disabled={isGenresPending}
      />

      <div className="mt-8 space-y-4">
        {tracks.data.map((track: Track) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </div>

      {tracks.meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={tracks.meta.page}
            totalPages={tracks.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
