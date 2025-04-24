import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerInModalProps {
  src: string;
  trackId: string;
}

export function AudioPlayerInModal({ src, trackId }: AudioPlayerInModalProps) {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    progressRef,
    audioRef,
    handlePlayPause,
    handleMute,
    handleSeek,
    handleTimeUpdate,
    handleLoadedMetadata,
    formatTime,
  } = useAudioPlayer(trackId + 'modal', src);

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="hidden"
      />

      <div className="flex items-center gap-2 rounded-lg">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="hover:bg-accent"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1">
          <div
            ref={progressRef}
            className="relative py-4 cursor-pointer group h-2"
            onClick={handleSeek}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full"
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 h-1 inset-0 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleMute}
          className="hover:bg-accent"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
} 