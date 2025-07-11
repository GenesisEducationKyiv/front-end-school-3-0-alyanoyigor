import { useState } from 'react';
import Button from '@mui/material/Button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import {
  useDeleteTrack,
  useDeleteTrackFile,
} from '@/features/tracks/service.hooks';
import { Track } from '@/features/tracks/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface ModalTrackDeleteProps {
  track: Track;
  children: React.ReactNode;
}

function DeleteTrackModal({ track, children }: ModalTrackDeleteProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: deleteTrack, isPending } = useDeleteTrack();
  const { mutateAsync: deleteTrackFile, isPending: isDeletingFile } =
    useDeleteTrackFile();

  const handleClose = () => {
    setOpen(false);
  };

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
        success: (
          <span data-testid="toast-success">Track deleted successfully</span>
        ),
        error: <span data-testid="toast-error">Failed to delete track</span>,
      }
    );

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} data-testid="confirm-dialog">
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
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
            variant="outlined"
            onClick={handleClose}
            disabled={isPending || isDeletingFile}
            aria-disabled={isPending || isDeletingFile}
            data-testid="cancel-delete"
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="error"
            variant="contained"
            startIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
            disabled={isPending || isDeletingFile}
            aria-disabled={isPending || isDeletingFile}
            data-testid="confirm-delete"
            data-loading={isPending}
          >
            Delete Track
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTrackModal;
