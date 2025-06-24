import { createContext, useContext } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Card, CardContent } from '../ui/card';
import { Track } from '@/types';

const TrackContext = createContext<{
  audioPlayerData: ReturnType<typeof useAudioPlayer>;
  track: Track;
}>(Object.create(null));

export const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error(
      'TrackItemContext must be rendered within the TrackItemContext component'
    );
  }
  return context;
};

export const TrackItemContext = ({
  children,
  track,
}: {
  children: React.ReactNode;
  track: Track;
}) => {
  const audioPlayerData = useAudioPlayer(track.id, track.audioFile);

  return (
    <TrackContext.Provider value={{ audioPlayerData, track }}>
      <Card
        className="group hover:bg-accent/50 transition-colors relative overflow-hidden"
        data-testid={`track-item-${track.id}`}
      >
        <CardContent className="py-2">{children}</CardContent>
      </Card>
    </TrackContext.Provider>
  );
};
