import { Toaster } from 'sonner';

import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { TrackList } from '@/components/track/TrackList';
import { Header } from '@/components/Header';

function App() {
  return (
    <AudioPlayerProvider>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Header />
        <TrackList />
        <Toaster />
      </main>
    </AudioPlayerProvider>
  );
}

export default App;
