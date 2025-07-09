import { lazy, Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Track } from '@/features/tracks/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

const UploadTrackForm = lazy(() => import('./UploadTrackForm'));

interface ModalTrackUploadProps {
  track: Track;
  children: React.ReactNode;
  disableAutoFocus?: boolean;
}

function UploadTrackModal({ track, children }: ModalTrackUploadProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload Track File</DialogTitle>
          <DialogDescription>
            Upload an audio file for {track.title}. Supported formats: MP3, WAV,
            M4A (max 50MB)
          </DialogDescription>
        </DialogHeader>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-45">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          }
        >
          <UploadTrackForm track={track} handleClose={handleClose} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

export default UploadTrackModal;
