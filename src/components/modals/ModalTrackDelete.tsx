import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { useDeleteTrack, useDeleteTrackFile } from '@/services/hooks';
import { ModalState, ModalStateSchema, Track } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalTrackDeleteProps {
  track: Track;
  open: ModalState;
  setOpen: (open: ModalState) => void;
}

export default function ModalTrackDelete({
  track,
  open,
  setOpen,
}: ModalTrackDeleteProps) {
  const { mutateAsync: deleteTrack, isPending } = useDeleteTrack();
  const { mutateAsync: deleteTrackFile, isPending: isDeletingFile } =
    useDeleteTrackFile();

  const handleDelete = async () => {
    toast.promise(
      async () => {
        if (track.audioFile) {
          await deleteTrackFile({ id: track.id });
        }
        await deleteTrack({ id: track.id });
      },
      {
        loading: <span data-testid="toast-loading">Deleting track...</span>,
        success: <span data-testid="toast-success">Track deleted successfully</span>,
        error: <span data-testid="toast-error">Failed to delete track</span>,
      }
    );
    setOpen(ModalStateSchema.Enum.closed);
  };

  return (
    <Dialog
      open={open === ModalStateSchema.Enum.open}
      onOpenChange={(open) => {
        setOpen(open ? ModalStateSchema.Enum.open : ModalStateSchema.Enum.closed);
      }}
      data-testid="confirm-dialog"
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Track</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-bold inline-block leading-2.5 truncate max-w-[200px] md:max-w-[300px]">
              {track.title}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(ModalStateSchema.Enum.closed)}
            disabled={isPending || isDeletingFile}
            aria-disabled={isPending || isDeletingFile}
            data-testid="cancel-delete"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || isDeletingFile}
            aria-disabled={isPending || isDeletingFile}
            data-testid="confirm-delete"
            data-loading={isPending}
          >
            {isPending ? (
              <>
                <Trash2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Track
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
