import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Button from '@mui/material/Button';

import { useGenres, useCreateTrack } from '@/features/tracks/service.hooks';
import { CreateTrackSchema } from '@/features/tracks/validation';
import { trackFormFields } from '@/features/tracks/consts';
import { CreateTrackDto } from '@/features/tracks/types';

import { InputField } from '@/shared/components/InputField';
import { GenreSelect } from '@/features/tracks/filters/GenreSelect';
import { Form, FormField } from '@/shared/components/ui/form';

export function CreateTrackForm({ handleClose }: { handleClose: () => void }) {
  const { data: availableGenres = [] } = useGenres();
  const { mutateAsync: createTrack } = useCreateTrack();

  const form = useForm<CreateTrackDto>({
    resolver: zodResolver(CreateTrackSchema),
    defaultValues: {
      title: '',
      artist: '',
      album: '',
      coverImage: '',
      genres: [],
    },
  });

  const onSubmit = async (data: CreateTrackDto) => {
    toast.promise(createTrack(data), {
      loading: <span data-testid="toast-loading">Creating track...</span>,
      success: () => (
        <span data-testid="toast-success">Track created successfully</span>
      ),
      error: <span data-testid="toast-error">Failed to create track</span>,
    });

    handleClose();
  };

  const handleAddGenre = (genre: string) => {
    const currentGenres = form.getValues('genres');
    if (!currentGenres.includes(genre)) {
      form.setValue('genres', [...currentGenres, genre]);
    }
  };

  const handleRemoveGenre = (genre: string) => {
    const currentGenres = form.getValues('genres');
    form.setValue(
      'genres',
      currentGenres.filter((g) => g !== genre)
    );
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
          selectedGenres={form.watch('genres')}
          error={
            Array.isArray(form.formState.errors.genres)
              ? form.formState.errors.genres[0]
              : form.formState.errors.genres
          }
          handleRemoveGenre={handleRemoveGenre}
          handleAddGenre={handleAddGenre}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" data-testid="submit-button">
            Create Track
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateTrackForm;
