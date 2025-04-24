import { lazy, useState } from "react";
import { Pencil, Upload, Trash } from "lucide-react";

import { ModalState, ModalStateEnum, Track } from "@/types";
import { Button } from "../ui/button";
import { LazyModal } from "../modals/LazyModal";

const ModalTrackUpload = lazy(() => import('@/components/modals/ModalTrackUpload'));
const ModalTrackUpdate = lazy(() => import('@/components/modals/ModalTrackUpdate'));
const ModalTrackDelete = lazy(() => import('@/components/modals/ModalTrackDelete'));

export function TrackActions({ track, genres }: { track: Track, genres: string[] }) {
  const [openModalDelete, setOpenModalDelete] = useState<ModalState>(
    ModalStateEnum.Idle
  );
  const [openModalUpload, setOpenModalUpload] = useState<ModalState>(
    ModalStateEnum.Idle
  );
  const [openModalUpdate, setOpenModalUpdate] = useState<ModalState>(
    ModalStateEnum.Idle
  );    

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary focus-within:text-primary"
        aria-label="Edit track"
        onClick={() => setOpenModalUpdate(ModalStateEnum.Open)}
        disabled={track.id.includes('optimistic')}
        aria-disabled={track.id.includes('optimistic')}
        data-testid={`edit-track-${track.id}`}
      >
        <Pencil className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary focus-within:text-primary"
        aria-label="Upload track"
        onClick={() => setOpenModalUpload(ModalStateEnum.Open)}
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
        onClick={() => setOpenModalDelete(ModalStateEnum.Open)}
        disabled={track.id.includes('optimistic')}
        aria-disabled={track.id.includes('optimistic')}
        data-testid={`delete-track-${track.id}`}
      >
        <Trash className="w-4 h-4" />
      </Button>

      {openModalUpdate !== ModalStateEnum.Idle && (
        <LazyModal>
          <ModalTrackUpdate
            track={track}
            genres={genres}
            open={openModalUpdate}
            setOpen={setOpenModalUpdate}
          />
        </LazyModal>
      )}

      {openModalUpload !== ModalStateEnum.Idle && (
        <LazyModal>
          <ModalTrackUpload
            track={track}
            disableAutoFocus={true}
            open={openModalUpload}
            setOpen={setOpenModalUpload}
          />
        </LazyModal>
      )}

      {openModalDelete !== ModalStateEnum.Idle && (
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
