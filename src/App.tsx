import { Toaster } from 'sonner';

import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { Header } from '@/components/Header';
import { TrackListPage } from '@/components/TrackListPage';

function App() {
  return (
    <AudioPlayerProvider>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Header />
        <TrackListPage />
        <div data-testid="toast-container">
          <Toaster />
        </div>
      </main>
    </AudioPlayerProvider>
  );
}

export default App;
