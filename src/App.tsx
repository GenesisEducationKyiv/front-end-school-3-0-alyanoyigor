import { Toaster } from 'sonner';

import { Header } from '@/shared/components/Header';
import { TrackListPage } from '@/features/tracks/components/TrackListPage';

function App() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Header />
      <TrackListPage />
      <div data-testid="toast-container">
        <Toaster />
      </div>
    </main>
  );
}

export default App;
