import { lazy, Suspense } from 'react';
import { useTrackContext } from '../track/TrackItemContext';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { Skeleton } from '@/components/ui/skeleton';

const TrackProgress = lazy(() => import('./TrackProgress'));

export function TrackAudioPlayer() {
  const activeTrackId = useAudioPlayerStore((state) => state.activeTrackId);
  const { audioPlayerData, track } = useTrackContext();
  const { audioRef, handleTimeUpdate, handleLoadedMetadata, isDirty } =
    audioPlayerData;
  const { id, audioFile } = track;

  return (
    <div
      className="absolute bottom-2 left-6 right-6"
      data-testid={`audio-player-${id}`}
    >
      <div className="w-full">
        <audio
          ref={audioRef}
          src={`${import.meta.env.VITE_API_URL}/api/files/${audioFile}`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="hidden"
        />

        {isDirty && activeTrackId === id && (
          <Suspense
            fallback={
              <div className="py-2">
                <Skeleton className="w-full h-1 rounded-full" />
              </div>
            }
          >
            <TrackProgress />
          </Suspense>
        )}
      </div>
    </div>
  );
}
