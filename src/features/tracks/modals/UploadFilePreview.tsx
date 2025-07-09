import { AudioPlayerInModal } from '@/features/audioPlayer/components/AudioPlayerInModal';
import { Button } from '@/shared/components/ui/button';
import { X } from 'lucide-react';

function UploadFilePreview({
  file,
  handleResetFile,
  audioSrc,
  trackId,
}: {
  file: File;
  handleResetFile: () => void;
  audioSrc: string;
  trackId: string;
}) {
  return (
    <div className="flex items-center flex-col  justify-between p-2 pl-4 border rounded-md space-y-2">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm truncate max-w-[200px] md:max-w-[300px]">
          {file.name}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleResetFile}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <AudioPlayerInModal src={audioSrc} trackId={trackId} />
    </div>
  );
}

export default UploadFilePreview;
