import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';

import { getDirtyValues } from '@/shared/lib/getDirtyValues';
import { useUpdateTrack } from '@/features/tracks/service.hooks';
import { Track, UpdateTrackDto } from '@/features/tracks/types';
import { UpdateTrackSchema } from '@/features/tracks/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackFormFields } from '@/features/tracks/consts';

import { Form, FormField } from '@/shared/components/ui/form';
import { InputField } from '@/shared/components/InputField';
import { GenreSelect } from '@/features/tracks/filters/GenreSelect';

interface UpdateTrackFormProps {
  track: Track;
  availableGenres: string[] | undefined;
  handleClose: () => void;
}

function UpdateTrackForm({
  track,
  availableGenres,
  handleClose,
}: UpdateTrackFormProps) {
  const { mutateAsync: updateTrack, isPending } = useUpdateTrack();

  const form = useForm<UpdateTrackDto>({
    resolver: zodResolver(UpdateTrackSchema),
    defaultValues: useMemo(
      () => ({
        title: track.title,
        artist: track.artist,
        album: track.album,
        coverImage: track.coverImage,
        genres: track.genres,
      }),
      [track]
    ),
  });

  useEffect(() => {
    form.reset(track);
  }, [track, form]);

  const onSubmit = async (data: UpdateTrackDto) => {
    const changedData = getDirtyValues(form.formState.dirtyFields, data);

    if (Object.keys(changedData).length !== 0) {
      toast.promise(updateTrack({ id: track.id, data: changedData }), {
        loading: <span data-testid="toast-loading">Saving...</span>,
        success: () => {
          form.reset();
          return (
            <span data-testid="toast-success">Track updated successfully</span>
          );
        },
        error: <span data-testid="toast-error">Failed to update track</span>,
      });
    }

    handleClose();
  };

  const handleAddGenre = (genre: string) => {
    const currentGenres = form.getValues('genres');
    if (currentGenres && !currentGenres.includes(genre)) {
      form.setValue('genres', [...currentGenres, genre], {
        shouldDirty: true,
      });
    }
  };

  const handleRemoveGenre = (genre: string) => {
    const currentGenres = form.getValues('genres');
    form.setValue('genres', currentGenres?.filter((g) => g !== genre) ?? [], {
      shouldDirty: true,
    });
  };

  return (
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
            variant="contained"
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
  );
}

export default UpdateTrackForm;
