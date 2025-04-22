import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Upload, Pencil, Music, Pause, Trash } from 'lucide-react';
import { Track } from '@/types';
import { Button } from '@/components/ui/button';
import { ModalTrackUpload } from '../modals/ModalTrackUpload';
import { ModalTrackUpdate } from '../modals/ModalTrackUpdate';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { cn } from '@/lib/utils';
import { ModalTrackDelete } from '../modals/ModalTrackDelete';

interface TrackItemProps {
  track: Track;
}

export function TrackItem({ track }: TrackItemProps) {
  const {
    isPlaying,
    progressRef,
    audioRef,
    handlePlayPause,
    handleSeek,
    handleTimeUpdate,
    handleLoadedMetadata,
    formatTime,
    currentTime,
    duration,
    isDirty,
  } = useAudioPlayer(track.id);

  return (
    <Card className="group hover:bg-accent/50 transition-colors relative overflow-hidden">
      <CardContent className="py-2">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            {track.coverImage ? (
              <img
                src={track.coverImage}
                alt={track.title}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            {track.audioFile && (
              <button
                onClick={handlePlayPause}
                className={cn(
                  'absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-md flex items-center justify-center',
                  isPlaying && 'opacity-100'
                )}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {track.artist}
              {track.album && ` • ${track.album}`}
            </p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {track.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <ModalTrackUpdate track={track}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary focus-within:text-primary"
                aria-label="Edit track"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </ModalTrackUpdate>
            <ModalTrackUpload track={track} disableAutoFocus={true}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary focus-within:text-primary"
                aria-label="Upload track"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </ModalTrackUpload>
            <ModalTrackDelete track={track}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary focus-within:text-primary"
                aria-label="Delete track"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </ModalTrackDelete>
          </div>
        </div>

        {track.audioFile && (
          <div className="absolute bottom-2 left-4 right-4">
            <div className="w-full">
            <audio
              ref={audioRef}
              src={`${import.meta.env.VITE_API_URL}/api/files/${
                track.audioFile
              }`}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />

            {isDirty && currentTime > 0 && (
              <>
                <div className="flex justify-end gap-1 text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm">
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
              </>
            )}
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
