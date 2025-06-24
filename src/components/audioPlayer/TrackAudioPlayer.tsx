import { formatTime } from '@/lib/utils';
import { useTrackContext } from '../track/TrackItemContext';

export function TrackAudioPlayer() {
  const { audioPlayerData, track } = useTrackContext();
  const {
    audioRef,
    currentTime,
    duration,
    progressRef,
    handleSeek,
    handleTimeUpdate,
    handleLoadedMetadata,
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
        <div
          className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
          data-testid={`audio-progress-${id}`}
        >
          <div className="flex-1">
            <div
              ref={progressRef}
              className="relative py-2 cursor-pointer progress"
              onClick={handleSeek}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              />
              <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary/20 rounded-full progress-hover:bg-primary/30 transition-colors w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
