import { Toaster } from 'sonner';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';

import { ModalTrackCreate } from './components/modals/ModalTrackCreate';
import { TrackList } from './components/track/TrackList';
import { Button } from './components/ui/button';

function App() {
  return (
    <AudioPlayerProvider>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Music tracks</h1>
          <ModalTrackCreate>
            <Button>Create track</Button>
          </ModalTrackCreate>
        </div>

        <TrackList />
        <Toaster />
      </main>
    </AudioPlayerProvider>
  );
}

export default App;
