import { lazy, Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ModalTrackCreateProps {
  children: React.ReactNode;
}

const CreateTrackForm = lazy(() => import('./CreateTrackForm'));

function CreateTrackModal({ children }: ModalTrackCreateProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>
            Add a new track to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-130">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          }
        >
          <CreateTrackForm handleClose={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTrackModal;
