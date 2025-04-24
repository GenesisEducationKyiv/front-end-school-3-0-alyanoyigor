import { useTracks } from '@/services/hooks';
import { CreateTrackDto, SortField, Track, UpdateTrackDto } from '@/types';

import { TrackItem } from './TrackItem';
import { TrackItemSkeleton } from './TrackItemSkeleton';
import { Pagination } from '../Pagination';
import { useMutationState } from '@tanstack/react-query';

interface TrackListProps {
  page: number;
  sortField: SortField | null;
  debouncedSearchTerm: string;
  selectedGenre: string | null;
  setPage: (page: number) => void;
  genres: string[];
}

export function TrackList({
  page,
  sortField,
  debouncedSearchTerm,
  selectedGenre,
  setPage,
  genres,
}: TrackListProps) {
  const {
    data: tracksFetchData,
    isPending,
    error,
  } = useTracks({
    ...(page > 1 && { page }),
    ...(sortField && { sort: sortField as SortField }),
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(selectedGenre && { genre: selectedGenre }),
  });

  const optimisticNewTracks = useMutationState({
    filters: { mutationKey: ['add-track'], status: 'pending' },
    select: (mutation) => mutation.state.variables as CreateTrackDto,
  });
  const [optimisticUpdatedTrack] = useMutationState({
    filters: { mutationKey: ['update-track'], status: 'pending' },
    select: (mutation) =>
      mutation.state.variables as { id: string; data: UpdateTrackDto },
  });
  const [optimisticDeletedTrack] = useMutationState({
    filters: { mutationKey: ['delete-track'], status: 'pending' },
    select: (mutation) => mutation.state.variables as { id: string },
  });

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

  const { data, meta: pagination } = tracksFetchData;
  const tracks = [
    ...optimisticNewTracks.map((track) => ({
      ...track,
      id: 'optimistic-' + Math.random(),
      slug: track.title.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...data
      .map((track) => {
        if (optimisticUpdatedTrack && track.id === optimisticUpdatedTrack.id) {
          return {
            ...track,
            ...optimisticUpdatedTrack.data,
          };
        }

        return track;
      })
      .filter((track) => {
        if (optimisticDeletedTrack && track.id === optimisticDeletedTrack.id) {
          return false;
        }

        return true;
      }),
  ];

  return (
    <>
      <div className="mt-8 space-y-4">
        {tracks.map((track: Track) => (
          <TrackItem key={track.id} track={track} genres={genres} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
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
