import { useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useDeleteTrackFile, useUploadTrackFile } from '@/services/hooks';
import { ModalState, ModalStateEnum, Track } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AudioPlayerInModal } from './AudioPlayerInModal';

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

interface ModalTrackUploadProps {
  track: Track;
  open: ModalState;
  setOpen: (open: ModalState) => void;
  disableAutoFocus?: boolean;
}

export default function ModalTrackUpload({
  track,
  open,
  setOpen,
  disableAutoFocus = false,
}: ModalTrackUploadProps) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile, isPending: isUploadPending } =
    useUploadTrackFile();
  const { mutateAsync: deleteFile, isPending: isDeletePending } =
    useDeleteTrackFile();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', data.file);

      await uploadFile({
        trackId: track.id,
        formData,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      toast.success('Success', {
        description: 'File uploaded successfully',
      });
      form.reset();
      setOpen(ModalStateEnum.Closed);
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to upload file',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async () => {
    try {
      await deleteFile(track.id);
      toast.success('Success', {
        description: 'File deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete file',
      });
    }
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

  const file = form.watch('file');

  const audioSrc = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  return (
    <Dialog
      open={open === ModalStateEnum.Open}
      onOpenChange={(open) => {
        setOpen(open ? ModalStateEnum.Open : ModalStateEnum.Closed);
        if (!open) {
          handleResetFile();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(event) => {
          if (disableAutoFocus) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Track File</DialogTitle>
          <DialogDescription>
            Upload an audio file for {track.title}. Supported formats: MP3, WAV,
            M4A (max 50MB)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
            </div>

            {form.formState.errors.file && (
              <p className="text-sm text-destructive">
                {form.formState.errors.file.message as string}
              </p>
            )}

            {file && (
              <div className="flex items-center flex-col  justify-between p-2 pl-4 border rounded-md space-y-2">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm truncate">
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

                <AudioPlayerInModal src={audioSrc} trackId={track.id} />
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {track.audioFile && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteFile}
                disabled={isUploadPending || isDeletePending}
              >
                {isDeletePending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                Remove File
              </Button>
            )}
            <Button
              type="submit"
              disabled={!file || isUploadPending || isDeletePending}
            >
              {isUploadPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
