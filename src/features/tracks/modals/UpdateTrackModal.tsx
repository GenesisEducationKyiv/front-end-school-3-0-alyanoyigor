import { lazy, Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Track } from '@/features/tracks/types';

const UpdateTrackForm = lazy(() => import('./UpdateTrackForm'));

interface ModalTrackUpdateProps {
  track: Track;
  genres: string[] | undefined;
  children: React.ReactNode;
}

function UpdateTrackModal({
  track,
  genres: availableGenres,
  children,
}: ModalTrackUpdateProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Track</DialogTitle>
          <DialogDescription>
            Update the details for{' '}
            <span className="font-bold inline-block leading-2.5 truncate max-w-[200px] md:max-w-[300px]">
              {track.title}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-120">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          }
        >
          <UpdateTrackForm
            track={track}
            availableGenres={availableGenres}
            handleClose={() => setOpen(false)}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateTrackModal;
