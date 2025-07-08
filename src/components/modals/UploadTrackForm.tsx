import { useRef, useMemo } from 'react';
import { Upload, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { AudioPlayerInModal } from '@/components/audioPlayer/AudioPlayerInModal';
import { useDeleteTrackFile, useUploadTrackFile } from '@/services/hooks';
import { Track } from '@/types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/x-m4a',
];

const formSchema = z.object({
  file: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      'File size must be less than 50MB'
    )
    .refine(
      (file) => ACCEPTED_AUDIO_TYPES.includes(file?.type),
      'Only .mp3, .wav, and .m4a files are accepted'
    ),
});

type FormData = z.infer<typeof formSchema>;

function UploadTrackForm({
  track,
  handleClose,
}: {
  track: Track;
  handleClose: () => void;
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile } = useUploadTrackFile();
  const { mutateAsync: deleteFile } = useDeleteTrackFile();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const file = form.watch('file');

  const audioSrc = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('file', data.file);

    toast.promise(
      uploadFile({
        trackId: track.id,
        formData,
      }),
      {
        loading: <span data-testid="toast-loading">Uploading...</span>,
        success: () => {
          handleResetFile();
          queryClient.invalidateQueries({ queryKey: ['tracks'] });

          return (
            <span data-testid="toast-success">File uploaded successfully</span>
          );
        },
        error: <span data-testid="toast-error">Failed to upload file</span>,
      }
    );

    handleClose();
  };

  const handleDeleteFile = () => {
    toast.promise(deleteFile({ id: track.id }), {
      loading: <span data-testid="toast-loading">Deleting...</span>,
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['tracks'] });

        return (
          <span data-testid="toast-success">File deleted successfully</span>
        );
      },
      error: <span data-testid="toast-error">Failed to delete file</span>,
    });
  };

  const handleResetFile = () => {
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.reset();

    const file = e.target.files?.[0];
    if (file) {
      form.setValue('file', file);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      data-testid="track-form"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-center w-full">
          <UploadArea
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
        </div>
        {form.formState.errors.file && (
          <p className="text-sm text-destructive">
            {form.formState.errors.file.message as string}
          </p>
        )}

        {file && (
          <FilePreview
            file={file}
            handleResetFile={handleResetFile}
            audioSrc={audioSrc}
            trackId={track.id}
          />
        )}
      </div>

      <div className="flex justify-end gap-2">
        {track.audioFile && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteFile}
          >
            <X className="w-4 h-4" />
            Remove File
          </Button>
        )}
        <Button
          type="submit"
          disabled={!file}
          aria-disabled={!file}
          data-testid="submit-button"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>
    </form>
  );
}

function UploadArea({
  handleFileChange,
  fileInputRef,
}: {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-8 h-8 mb-2" />
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-muted-foreground">
          MP3, WAV, M4A (max 50MB)
        </p>
      </div>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".mp3,.wav,.m4a"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </label>
  );
}

function FilePreview({
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

export default UploadTrackForm;
