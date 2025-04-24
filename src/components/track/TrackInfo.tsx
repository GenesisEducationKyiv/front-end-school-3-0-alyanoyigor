import { Music, Pause, Play } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Track } from '@/types';

interface TrackImageProps {
  track: Track;
  handlePlayPause: () => void;
  isPlaying: boolean;
}

export function TrackImage({
  track,
  handlePlayPause,
  isPlaying,
}: TrackImageProps) {
  return (
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
          data-testid={`${isPlaying ? 'pause' : 'play'}-button-${track.id}`}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
      )}
    </div>
  );
}

export function TrackText({ track }: { track: Track }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold truncate" data-testid={`track-item-${track.id}-title`}>{track.title}</h3>
      <p className="text-sm text-muted-foreground truncate">
        <span data-testid={`track-item-${track.id}-artist`}>{track.artist}</span>
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
  );
}
