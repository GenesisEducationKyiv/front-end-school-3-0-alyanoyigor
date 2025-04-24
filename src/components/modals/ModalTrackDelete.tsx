import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { useDeleteTrack, useDeleteTrackFile } from '@/services/hooks';
import { ModalState, ModalStateEnum, Track } from '@/types';
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
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTrack, isPending } = useDeleteTrack();
  const { mutateAsync: deleteTrackFile, isPending: isDeletingFile } =
    useDeleteTrackFile();

  const handleDelete = async () => {
    try {
      if (track.audioFile) {
        await deleteTrackFile({ id: track.id });
      }
      await deleteTrack({ id: track.id });

      toast.success('Track deleted successfully');

      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      setOpen(ModalStateEnum.Closed);
    } catch (error) {
      toast.error('Failed to delete track');
    }
  };

  return (
    <Dialog
      open={open === ModalStateEnum.Open}
      onOpenChange={(open) => {
        setOpen(open ? ModalStateEnum.Open : ModalStateEnum.Closed);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Track</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-bold inline-block leading-2.5 truncate max-w-[200px] md:max-w-[300px]">{track.title}</span>? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(ModalStateEnum.Closed)}
            disabled={isPending || isDeletingFile}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || isDeletingFile}
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
