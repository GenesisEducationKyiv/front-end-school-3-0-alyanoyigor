import { Pencil, Upload, Trash } from 'lucide-react';

import { Button } from '../ui/button';
import { useTrackContext } from './TrackItemContext';

import UpdateTrackModal from '@/components/modals/UpdateTrackModal';
import UploadTrackModal from '@/components/modals/UploadTrackModal';
import DeleteTrackModal from '@/components/modals/DeleteTrackModal';

interface TrackActionsProps {
  genres: string[] | undefined;
}

export function TrackActions({ genres }: TrackActionsProps) {
  const { track } = useTrackContext();

  return (
    <div className="flex gap-2">
      <UpdateTrackModal track={track} genres={genres}>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary focus-within:text-primary"
          aria-label="Edit track"
          disabled={track.id.includes('optimistic')}
          aria-disabled={track.id.includes('optimistic')}
          data-testid={`edit-track-${track.id}`}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </UpdateTrackModal>

      <UploadTrackModal track={track}>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary focus-within:text-primary"
          aria-label="Upload track"
          disabled={track.id.includes('optimistic')}
          aria-disabled={track.id.includes('optimistic')}
          data-testid={`upload-track-${track.id}`}
        >
          <Upload className="w-4 h-4" />
        </Button>
      </UploadTrackModal>

      <DeleteTrackModal track={track}>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary focus-within:text-primary"
          aria-label="Delete track"
          disabled={track.id.includes('optimistic')}
          aria-disabled={track.id.includes('optimistic')}
          data-testid={`delete-track-${track.id}`}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </DeleteTrackModal>
    </div>
  );
}
