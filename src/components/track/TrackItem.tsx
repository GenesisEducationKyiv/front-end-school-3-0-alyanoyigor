import { Card, CardContent } from '@/components/ui/card';
import { Track } from '@/types';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

import { TrackText } from './TrackInfo';
import { TrackImage } from './TrackInfo';
import { TrackActions } from './TrackActions';
import { TrackAudioPlayer } from './TrackAudioPlayer';

interface TrackItemProps {
  track: Track;
  genres: string[];
}

export function TrackItem({ track, genres }: TrackItemProps) {
  const { isPlaying, handlePlayPause, ...audioPlayerProps } = useAudioPlayer(
    track.id,
    track.audioFile
  );

  return (
    <Card className="group hover:bg-accent/50 transition-colors relative overflow-hidden" data-testid={`track-item-${track.id}`}>
      <CardContent className="py-2">
        <div className="flex items-center gap-4">
          <TrackImage
            track={track}
            handlePlayPause={handlePlayPause}
            isPlaying={isPlaying}
          />
          <TrackText track={track} />
          <TrackActions track={track} genres={genres} />
        </div>

        {track.audioFile && (
          <TrackAudioPlayer id={track.id} audioFile={track.audioFile} {...audioPlayerProps} />
        )}
      </CardContent>
    </Card>
  );
}
