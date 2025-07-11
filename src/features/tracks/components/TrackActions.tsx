import { Pencil, Upload, Trash } from 'lucide-react';
import IconButton from '@mui/material/IconButton';

import UpdateTrackModal from '@/features/tracks/modals/UpdateTrackModal';
import UploadTrackModal from '@/features/tracks/modals/UploadTrackModal';
import DeleteTrackModal from '@/features/tracks/modals/DeleteTrackModal';

import { useTrackContext } from './TrackItemContext';

interface TrackActionsProps {
  genres: string[] | undefined;
}

export function TrackActions({ genres }: TrackActionsProps) {
  const { track } = useTrackContext();

  return (
    <div className="flex gap-2">
      <UpdateTrackModal track={track} genres={genres}>
        <IconButton
          aria-label="Edit track"
          disabled={track.id.includes('optimistic')}
          aria-disabled={track.id.includes('optimistic')}
          data-testid={`edit-track-${track.id}`}
        >
          <Pencil className="w-4 h-4" />
        </IconButton>
      </UpdateTrackModal>

      <UploadTrackModal track={track}>
        <IconButton
          aria-label="Upload track"
          disabled={track.id.includes('optimistic')}
          aria-disabled={track.id.includes('optimistic')}
          data-testid={`upload-track-${track.id}`}
        >
          <Upload className="w-4 h-4" />
        </IconButton>
      </UploadTrackModal>

      <DeleteTrackModal track={track}>
        <IconButton
          aria-label="Delete track"
          disabled={track.id.includes('optimistic')}
          aria-disabled={track.id.includes('optimistic')}
          data-testid={`delete-track-${track.id}`}
        >
          <Trash className="w-4 h-4" />
        </IconButton>
      </DeleteTrackModal>
    </div>
  );
}
