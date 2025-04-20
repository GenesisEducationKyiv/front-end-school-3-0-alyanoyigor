import { TrackList } from './components/TrackList';
import { Button } from './components/ui/button';

function App() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Music tracks</h1>
        <Button>Create track</Button>
      </div>

      <TrackList />
    </main>
  );
}

export default App;
