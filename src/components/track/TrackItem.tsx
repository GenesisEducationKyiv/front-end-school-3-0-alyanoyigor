import { Track } from '@/types';

import { TrackText } from './TrackInfo';
import { TrackImage } from './TrackInfo';
import { TrackActions } from './TrackActions';
import { TrackAudioPlayer } from '../audioPlayer/TrackAudioPlayer';
import { TrackItemContext } from './TrackItemContext';

interface TrackItemProps {
  track: Track;
  genres: string[] | undefined;
}

export function TrackItem({ track, genres }: TrackItemProps) {
  return (
    <TrackItemContext track={track}>
      <div className="flex items-center gap-4">
        <TrackImage />
        <TrackText />
        <TrackActions genres={genres} />
      </div>

      {track.audioFile && <TrackAudioPlayer />}
    </TrackItemContext>
  );
}
