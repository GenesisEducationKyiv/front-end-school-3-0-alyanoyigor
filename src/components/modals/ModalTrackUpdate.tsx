import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useUpdateTrack } from '@/services/hooks';
import { ModalState, ModalStateEnum, Track, UpdateTrackDto } from '@/types';
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
import { InputField } from './InputField';
import { UpdateTrackSchema } from '@/validation';
import { GenreSelect } from './GenreSelect';

interface ModalTrackUpdateProps {
  track: Track;
  genres: string[];
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
    const isArrayEqual = (a: string[], b: string[]) => {
      return (
        a.length === b.length && a.every((value, index) => value === b[index])
      );
    };
    const updatedData = Object.keys(data).reduce<Partial<UpdateTrackDto>>(
      (acc, key) => {
        const typedKey = key as keyof UpdateTrackDto;
        if (!typedKey) return acc;

        if (
          (Array.isArray(data[typedKey]) &&
            !isArrayEqual(
              data[typedKey] as string[],
              track[typedKey] as string[]
            )) ||
          (!Array.isArray(data[typedKey]) &&
            data[typedKey] !== track[typedKey as keyof Track])
        ) {
          acc[typedKey] = data[typedKey] as (string[] & string) | undefined;
        }
        return acc;
      },
      {}
    );

    toast.promise(updateTrack({ id: track.id, data: updatedData }), {
      loading: 'Saving...',
      success: () => {
        form.reset();
        return 'Track updated successfully';
      },
      error: 'Failed to update track',
    });

    setOpen(ModalStateEnum.Closed);
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
          <DialogTitle>Edit Track</DialogTitle>
          <DialogDescription>
            Update the details for{' '}
            <span className="font-bold inline-block leading-2.5 truncate max-w-[200px] md:max-w-[300px]">
              {track.title}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {trackFormFields.map(({ name, label, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <InputField
                    field={field}
                    label={label}
                    placeholder={placeholder}
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
