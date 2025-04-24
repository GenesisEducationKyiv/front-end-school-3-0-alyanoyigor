import { createContext, useContext, useState } from 'react';

interface AudioPlayerContextType {
  currentPlayingId: string | null;
  setCurrentPlayingId: (id: string | null) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  return (
    <AudioPlayerContext.Provider
      value={{ currentPlayingId, setCurrentPlayingId }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      'useAudioPlayerContext must be used within an AudioPlayerProvider'
    );
  }
  return context;
}
