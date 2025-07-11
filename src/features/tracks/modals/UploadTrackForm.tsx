import { useRef, useMemo } from 'react';
import { Upload, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useDeleteTrackFile,
  useUploadTrackFile,
} from '@/features/tracks/service.hooks';
import { Track } from '@/features/tracks/types';
import {
  UploadTrackFormData,
  UploadTrackSchema,
} from '@/features/tracks/validation';
import UploadArea from './UploadArea';
import UploadFilePreview from './UploadFilePreview';

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

  const form = useForm<UploadTrackFormData>({
    resolver: zodResolver(UploadTrackSchema),
  });

  const file = form.watch('file');

  const audioSrc = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  const onSubmit = (data: UploadTrackFormData) => {
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
          <UploadFilePreview
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
            startIcon={<X className="w-4 h-4" />}
            variant="outlined"
            color="error"
            onClick={handleDeleteFile}
          >
            Remove File
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<Upload className="w-4 h-4" />}
          type="submit"
          disabled={!file}
          aria-disabled={!file}
          data-testid="submit-button"
        >
          Upload
        </Button>
      </div>
    </form>
  );
}

export default UploadTrackForm;
