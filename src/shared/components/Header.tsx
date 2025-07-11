import Button from '@mui/material/Button';
import ModalTrackCreate from '@/features/tracks/modals/CreateTrackModal';

export function Header() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold" data-testid="tracks-header">
        Music tracks
      </h1>

      <ModalTrackCreate>
        <Button data-testid="create-track-button" variant="contained">
          Create track
        </Button>
      </ModalTrackCreate>
    </div>
  );
}
