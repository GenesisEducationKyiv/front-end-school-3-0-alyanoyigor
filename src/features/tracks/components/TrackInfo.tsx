import Chip from '@mui/material/Chip';
import { Music, Pause, Play } from 'lucide-react';

import { useAudioPlayerStore } from '@/features/audioPlayer/store';
import { cn } from '@/shared/lib/utils';

import { useTrackContext } from './TrackItemContext';

function PlayButton() {
  const { audioPlayerData, track } = useTrackContext();
  const activeTrackId = useAudioPlayerStore((state) => state.activeTrackId);
  const isActiveTrack = activeTrackId === track.id;

  return (
    <button
      onClick={audioPlayerData.handlePlayPause}
      className={cn(
        'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center',
        isActiveTrack && 'opacity-100'
      )}
      data-testid={`${audioPlayerData.isPlaying ? 'pause' : 'play'}-button-${track.id}`}
    >
      {audioPlayerData.isPlaying ? (
        <Pause className="w-8 h-8 text-white" />
      ) : (
        <Play className="w-8 h-8 text-white" />
      )}
    </button>
  );
}

export function TrackImage() {
  const { track } = useTrackContext();
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
      {track.audioFile && <PlayButton />}
    </div>
  );
}

export function TrackText() {
  const { track } = useTrackContext();

  return (
    <div className="flex-1 min-w-0">
      <h3
        className="font-semibold truncate"
        data-testid={`track-item-${track.id}-title`}
      >
        {track.title}
      </h3>
      <p className="text-sm text-muted-foreground truncate">
        <span data-testid={`track-item-${track.id}-artist`}>
          {track.artist}
        </span>
        {track.album && ` • ${track.album}`}
      </p>
      <div className="flex gap-1 mt-1 flex-wrap">
        {track.genres.map((genre: string) => (
          <Chip
            key={genre}
            label={genre}
            variant="filled"
            color="secondary"
            size="small"
          />
        ))}
      </div>
    </div>
  );
}
