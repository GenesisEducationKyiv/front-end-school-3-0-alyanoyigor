import { lazy, Suspense } from 'react';
import { formatTime } from '@/lib/utils';
import { useTrackContext } from '../track/TrackItemContext';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';

const TrackProgress = lazy(() => import('./TrackProgress'));

export function TrackAudioPlayer() {
  const activeTrackId = useAudioPlayerStore((state) => state.activeTrackId);
  const { audioPlayerData, track } = useTrackContext();
  const {
    audioRef,
    currentTime,
    duration,
    handleTimeUpdate,
    handleLoadedMetadata,
    isDirty,
  } = audioPlayerData;
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

        <div className="flex justify-end gap-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {isDirty && activeTrackId === id && (
          <Suspense fallback={null}>
            <TrackProgress />
          </Suspense>
        )}
      </div>
    </div>
  );
}
