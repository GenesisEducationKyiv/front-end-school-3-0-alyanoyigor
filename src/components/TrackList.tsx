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
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    selectedGenresQuery.success && selectedGenresQuery.data 
      ? [selectedGenresQuery.data] 
      : []
  );

  const {
    data: tracks,
    isPending,
    error,
  } = useTracks(page, {
    ...(sortField && { sort: sortField }),
    ...(searchTerm && { search: searchTerm }),
    ...(selectedGenres.length > 0 && { genre: selectedGenres[0] }),
  });

  useEffect(() => {
    const params: Record<string, string> = {};

    if (page !== initialPage) params.page = page.toString();
    if (sortField) params.sort = sortField;
    if (searchTerm) params.search = searchTerm;
    if (selectedGenres.length > 0) params.genre = selectedGenres[0];

    setSearchParams(params);
  }, [page, sortField, searchTerm, selectedGenres, initialPage, setSearchParams]);

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
          <Filter
            options={genres || []}
            selected={selectedGenres}
            onSelect={(genre) => setSelectedGenres([genre])}
            onDeselect={() => setSelectedGenres([])}
            placeholder="Filter by genre..."
            disabled={isGenresPending}
          />
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

          {/* {sortField && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSort}
                title="Clear sort"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )} */}
        </div>
      </div>

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
