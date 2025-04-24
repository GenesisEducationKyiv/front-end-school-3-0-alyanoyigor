import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useGenres, useCreateTrack } from '@/services/hooks';
import { CreateTrackDto, ModalState, ModalStateEnum } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { CreateTrackSchema } from '@/validation';
import { trackFormFields } from '@/consts';

import { InputField } from './InputField';
import { GenreSelect } from './GenreSelect';
import { useCallback } from 'react';

interface ModalTrackCreateProps {
  open: ModalState;
  setOpen: (open: ModalState) => void;
}

export default function ModalTrackCreate({
  open,
  setOpen,
}: ModalTrackCreateProps) {
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
      loading: 'Creating track...',
      success: () => {
        form.reset();
        return 'Track created successfully';
      },
      error: 'Failed to create track',
    });

    setOpen(ModalStateEnum.Closed);
  };

  const handleAddGenre = useCallback(
    (genre: string) => {
      const currentGenres = form.getValues('genres');
      if (!currentGenres.includes(genre)) {
        form.setValue('genres', [...currentGenres, genre]);
      }
    },
    [form]
  );

  const handleRemoveGenre = useCallback(
    (genre: string) => {
      const currentGenres = form.getValues('genres');
      form.setValue(
        'genres',
        currentGenres.filter((g) => g !== genre)
      );
    },
    [form]
  );

  return (
    <Dialog
      open={open === ModalStateEnum.Open}
      onOpenChange={(open) => {
        setOpen(open ? ModalStateEnum.Open : ModalStateEnum.Closed);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>
            Add a new track to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="track-form">
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
                onClick={() => {
                  setOpen(ModalStateEnum.Closed);
                  form.reset();
                }}
                disabled={isPending}
                aria-disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="submit-button" aria-disabled={isPending} data-loading={isPending} >
                {isPending ? 'Creating...' : 'Create Track'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
