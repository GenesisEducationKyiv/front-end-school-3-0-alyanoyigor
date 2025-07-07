import { createContext, useContext, useState } from 'react';

interface AudioPlayerContextType {
  currentPlayingId: string | null;
  setCurrentPlayingId: (id: string | null) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  return (
    <AudioPlayerContext.Provider
      value={{ currentPlayingId, setCurrentPlayingId }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      'useAudioPlayerContext must be used within an AudioPlayerProvider'
    );
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AudioPlayerProvider, useAudioPlayerContext };
