import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useGenres, useCreateTrack } from '@/services/hooks';
import { CreateTrackSchema } from '@/validation';
import { trackFormFields } from '@/consts';
import { CreateTrackDto } from '@/types';

import { InputField } from '@/components/InputField';
import { GenreSelect } from '@/components/filters/GenreSelect';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';

export function CreateTrackForm({ handleClose }: { handleClose: () => void }) {
  const { data: availableGenres = [] } = useGenres();
  const { mutateAsync: createTrack, isPending } = useCreateTrack();

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
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            aria-disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            data-testid="submit-button"
            aria-disabled={isPending}
            data-loading={isPending}
          >
            {isPending ? 'Creating...' : 'Create Track'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateTrackForm;
