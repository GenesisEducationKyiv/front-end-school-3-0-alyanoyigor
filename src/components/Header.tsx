import { lazy, useState } from 'react';
import { ModalState, ModalStateSchema } from '@/types';
import { Button } from '@/components/ui/button';
import { LazyModal } from '@/components/modals/LazyModal';

const ModalTrackCreate = lazy(
  () => import('@/components/modals/ModalTrackCreate')
);

export function Header() {
  const [openModalCreate, setOpenModalCreate] = useState<ModalState>(
    ModalStateSchema.Enum.idle
  );
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold" data-testid="tracks-header">
        Music tracks
      </h1>
      <Button
        onClick={() => setOpenModalCreate(ModalStateSchema.Enum.open)}
        data-testid="create-track-button"
      >
        Create track
      </Button>
      {openModalCreate !== ModalStateSchema.Enum.idle && (
        <LazyModal>
          <ModalTrackCreate
            open={openModalCreate}
            setOpen={setOpenModalCreate}
          />
        </LazyModal>
      )}
    </div>
  );
}
