import { Button } from '../components/ui/button';
import ModalTrackCreate from '../../features/tracks/modals/CreatelTrackModal';

export function Header() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold" data-testid="tracks-header">
        Music tracks
      </h1>

      <ModalTrackCreate>
        <Button data-testid="create-track-button">Create track</Button>
      </ModalTrackCreate>
    </div>
  );
}
