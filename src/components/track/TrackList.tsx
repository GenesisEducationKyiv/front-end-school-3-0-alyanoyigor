import { useTracks } from '@/services/hooks';
import { SortField, Track } from '@/types';
import { useOptimisticTracks } from '@/hooks/useOptimisticTracks';

import { TrackItem } from './TrackItem';
import { TrackItemSkeleton } from './TrackItemSkeleton';
import { Pagination } from '../Pagination';

interface TrackListProps {
  page: number;
  sortField: SortField | null;
  debouncedSearchTerm: string;
  selectedGenre: string | null;
  setPage: (page: number) => void;
  genres: string[] | undefined;
}

export function TrackList({
  page,
  sortField,
  debouncedSearchTerm,
  selectedGenre,
  setPage,
  genres,
}: TrackListProps) {
  const trackQueryParams = {
    ...(page > 1 && { page }),
    ...(sortField && { sort: sortField }),
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(selectedGenre && { genre: selectedGenre }),
  };

  const { data: tracksData, isPending, error } = useTracks(trackQueryParams);
  const initialTracks = tracksData?.data || [];
  const pagination = tracksData?.meta;
  const tracks = useOptimisticTracks(initialTracks);

  if (isPending) {
    return (
      <div className="mt-8 space-y-4" data-testid="loading-tracks">
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
    <>
      <div className="mt-8 space-y-4">
        {tracks.map((track: Track) => (
          <TrackItem key={track.id} track={track} genres={genres} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}
