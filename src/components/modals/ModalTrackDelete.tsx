import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { useDeleteTrack } from '@/services/hooks';
import { Track } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalTrackDeleteProps {
  track: Track;
  children: React.ReactNode;
}

export function ModalTrackDelete({ track, children }: ModalTrackDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTrack, isPending } = useDeleteTrack();

  const handleDelete = async () => {
    try {
      await deleteTrack({ id: track.id });

      toast.success('Track deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to delete track');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Track</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{track.title}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
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
