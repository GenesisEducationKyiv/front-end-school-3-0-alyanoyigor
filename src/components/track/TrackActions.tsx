import { lazy, useState } from 'react';
import { Pencil, Upload, Trash } from 'lucide-react';

import { ModalState, ModalStateSchema, Track } from '@/types';
import { Button } from '../ui/button';
import { LazyModal } from '../modals/LazyModal';

const ModalTrackUpload = lazy(
  () => import('@/components/modals/ModalTrackUpload')
);
const ModalTrackUpdate = lazy(
  () => import('@/components/modals/ModalTrackUpdate')
);
const ModalTrackDelete = lazy(
  () => import('@/components/modals/ModalTrackDelete')
);

interface TrackActionsProps {
  track: Track;
  genres: string[] | undefined;
}

export function TrackActions({ track, genres }: TrackActionsProps) {
  const [openModalDelete, setOpenModalDelete] = useState<ModalState>(
    ModalStateSchema.Enum.idle
  );
  const [openModalUpload, setOpenModalUpload] = useState<ModalState>(
    ModalStateSchema.Enum.idle
  );
  const [openModalUpdate, setOpenModalUpdate] = useState<ModalState>(
    ModalStateSchema.Enum.idle
  );

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary focus-within:text-primary"
        aria-label="Edit track"
        onClick={() => setOpenModalUpdate(ModalStateSchema.Enum.open)}
        disabled={track.id.includes('optimistic')}
        aria-disabled={track.id.includes('optimistic')}
        data-testid="edit-track"
      >
        <Pencil className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary focus-within:text-primary"
        aria-label="Upload track"
        onClick={() => setOpenModalUpload(ModalStateSchema.Enum.open)}
        disabled={track.id.includes('optimistic')}
        aria-disabled={track.id.includes('optimistic')}
        data-testid={`upload-track-${track.id}`}
      >
        <Upload className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary focus-within:text-primary"
        aria-label="Delete track"
        onClick={() => setOpenModalDelete(ModalStateSchema.Enum.open)}
        disabled={track.id.includes('optimistic')}
        aria-disabled={track.id.includes('optimistic')}
        data-testid="delete-track"
      >
        <Trash className="w-4 h-4" />
      </Button>

      {openModalUpdate !== ModalStateSchema.Enum.idle && (
        <LazyModal>
          <ModalTrackUpdate
            track={track}
            genres={genres}
            open={openModalUpdate}
            setOpen={setOpenModalUpdate}
          />
        </LazyModal>
      )}

      {openModalUpload !== ModalStateSchema.Enum.idle && (
        <LazyModal>
          <ModalTrackUpload
            track={track}
            disableAutoFocus={true}
            open={openModalUpload}
            setOpen={setOpenModalUpload}
          />
        </LazyModal>
      )}

      {openModalDelete !== ModalStateSchema.Enum.idle && (
        <LazyModal>
          <ModalTrackDelete
            track={track}
            open={openModalDelete}
            setOpen={setOpenModalDelete}
          />
        </LazyModal>
      )}
    </div>
  );
}
