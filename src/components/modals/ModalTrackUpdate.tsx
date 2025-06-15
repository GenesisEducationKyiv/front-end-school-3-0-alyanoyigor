import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useUpdateTrack } from '@/services/hooks';
import { ModalState, ModalStateSchema, Track, UpdateTrackDto } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { trackFormFields } from '@/consts';
import { InputField } from '../InputField';
import { UpdateTrackSchema } from '@/validation';
import { GenreSelect } from '../filters/GenreSelect';
import { getDirtyValues } from '@/lib/getDirtyValues';

interface ModalTrackUpdateProps {
  track: Track;
  genres: string[] | undefined;
  open: ModalState;
  setOpen: (open: ModalState) => void;
}

export default function ModalTrackUpdate({
  track,
  open,
  setOpen,
  genres: availableGenres,
}: ModalTrackUpdateProps) {
  const { mutateAsync: updateTrack, isPending } = useUpdateTrack();

  const form = useForm<UpdateTrackDto>({
    resolver: zodResolver(UpdateTrackSchema),
    defaultValues: useMemo(() => {
      return {
        title: track.title,
        artist: track.artist,
        album: track.album,
        coverImage: track.coverImage,
        genres: track.genres,
      };
    }, [track]),
  });

  useEffect(() => {
    form.reset(track);
  }, [track]);

  const onSubmit = async (data: UpdateTrackDto) => {
    // Add to request only changed fields
    const changedData = getDirtyValues(form.formState.dirtyFields, data);

    toast.promise(updateTrack({ id: track.id, data: changedData }), {
      loading: <span data-testid="toast-loading">Saving...</span>,
      success: () => {
        form.reset();
        return <span data-testid="toast-success">Track updated successfully</span>;
      },
      error: <span data-testid="toast-error">Failed to update track</span>,
    });

    setOpen(ModalStateSchema.Enum.closed);
  };

  const handleAddGenre = (genre: string) => {
    const currentGenres = form.getValues('genres');
    if (currentGenres && !currentGenres.includes(genre)) {
      form.setValue('genres', [...currentGenres, genre]);
    }
  };

  const handleRemoveGenre = (genre: string) => {
    const currentGenres = form.getValues('genres');
    form.setValue('genres', currentGenres?.filter((g) => g !== genre) ?? []);
  };

  return (
    <Dialog
      open={open === ModalStateSchema.Enum.open}
      onOpenChange={(open) => {
        setOpen(open ? ModalStateSchema.Enum.open : ModalStateSchema.Enum.closed);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Track</DialogTitle>
          <DialogDescription>
            Update the details for{' '}
            <span className="font-bold inline-block leading-2.5 truncate max-w-[200px] md:max-w-[300px]">
              {track.title}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="track-form"
          >
            {trackFormFields.map(({ name, label, placeholder, testId }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <InputField
                    field={field}
                    label={label}
                    placeholder={placeholder}
                    testId={testId}
                  />
                )}
              />
            ))}

            <GenreSelect
              availableGenres={availableGenres}
              selectedGenres={form.watch('genres') || []}
              error={
                Array.isArray(form.formState.errors.genres)
                  ? form.formState.errors.genres[0]
                  : form.formState.errors.genres
              }
              handleRemoveGenre={handleRemoveGenre}
              handleAddGenre={handleAddGenre}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                aria-disabled={isPending}
                data-testid="submit-button"
                data-loading={isPending}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
