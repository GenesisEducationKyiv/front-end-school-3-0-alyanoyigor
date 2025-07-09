import { Option } from '@mobily/ts-belt';

import { Pagination } from '@/features/tracks/filters/Pagination';

import { useTracks } from '@/features/tracks/service.hooks';
import { SortField, Track } from '@/features/tracks/types';
import { useOptimisticTracks } from '@/features/tracks/hooks/useOptimisticTracks';

import { TrackItem } from './TrackItem';
import { TrackItemSkeleton } from './TrackItemSkeleton';

interface TrackListProps {
  page: Option<number>;
  sortField: Option<SortField>;
  debouncedSearchTerm: Option<string>;
  selectedGenre: Option<string>;
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
    ...(page && page > 1 && { page }),
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
