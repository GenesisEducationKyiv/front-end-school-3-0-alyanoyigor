import { lazy, useState } from 'react';
import { ModalState, ModalStateEnum } from '@/types';
import { Button } from '@/components/ui/button';
import { LazyModal } from '@/components/modals/LazyModal';

const ModalTrackCreate = lazy(() => import('@/components/modals/ModalTrackCreate'));

export function Header() {
  const [openModalCreate, setOpenModalCreate] = useState<ModalState>(
    ModalStateEnum.Idle
  );
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold" data-testid="tracks-header">Music tracks</h1>
      <Button onClick={() => setOpenModalCreate(ModalStateEnum.Open)} data-testid="create-track-button">
        Create track
      </Button>
      {openModalCreate !== ModalStateEnum.Idle && (
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