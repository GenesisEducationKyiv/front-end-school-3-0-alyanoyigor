import { useGenres, useTracks } from '@/services/hooks';
import { Track } from '@/types';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// import { X } from 'lucide-react';
import { z } from 'zod';

// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from './Filter';
import { GenreFilter } from './GenreFilter';
import { TrackItem } from './TrackItem';
import { Pagination } from './Pagination';
import { TrackItemSkeleton } from './TrackItemSkeleton';

const SortFieldSchema = z.enum(['title', 'artist', 'album', 'createdAt']);
// const SortOrderSchema = z.enum(['asc', 'desc']);
type SortField = z.infer<typeof SortFieldSchema>;
// type SortOrder = z.infer<typeof SortOrderSchema>;

export function TrackList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const { data: genres, isPending: isGenresPending } = useGenres();

  const sortValueQuery = SortFieldSchema.safeParse(searchParams.get('sort'));
  // const sortOrderQuery = SortOrderSchema.safeParse(searchParams.get('order'));
  const selectedGenresQuery = genres
    ? z
        .enum(genres as [string, ...string[]])
        .safeParse(searchParams.get('genre'))
    : { success: false, data: '' };

  const [sortField, setSortField] = useState<SortField | null>(
    sortValueQuery.success ? sortValueQuery.data : null
  );
  // const [sortOrder, setSortOrder] = useState<SortOrder | null>(
  //   sortOrderQuery.success ? sortOrderQuery.data : null
  // );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    selectedGenresQuery.success && selectedGenresQuery.data 
      ? selectedGenresQuery.data 
      : null
  );

  const {
    data: tracks,
    isPending,
    error,
  } = useTracks(page, {
    ...(sortField && { sort: sortField }),
    ...(searchTerm && { search: searchTerm }),
    ...(selectedGenre && { genre: selectedGenre }),
  });

  useEffect(() => {
    const params: Record<string, string> = {};

    if (page !== initialPage) params.page = page.toString();
    if (sortField) params.sort = sortField;
    if (searchTerm) params.search = searchTerm;
    if (selectedGenre) params.genre = selectedGenre;

    setSearchParams(params);
  }, [page, sortField, searchTerm, selectedGenre, initialPage, setSearchParams]);

  // const handleClearSort = () => {
  //   setSortField(null);
  //   setSortOrder(null);
  // };

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortField || ''}
            onValueChange={(value: string) => setSortField(value as SortField)}
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

      {tracks.meta && (
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
