import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  coverImage: z.string().url('Must be a valid URL').or(z.literal('')),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
});

interface ModalTrackCreateProps {
  open: ModalState;
  setOpen: (open: ModalState) => void;
}

export default function ModalTrackCreate({ open, setOpen }: ModalTrackCreateProps) {
  const { data: availableGenres = [] } = useGenres();
  const { mutateAsync: createTrack, isPending } = useCreateTrack();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist: '',
      album: '',
      coverImage: '',
      genres: [],
    },
  });

  const onSubmit = async (data: CreateTrackDto) => {
    try {
      await createTrack(data);

      toast.success('Success', {
        description: 'Track created successfully',
      });
      form.reset();
      setOpen(ModalStateEnum.Closed);

      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to create track',
      });
    }
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
    <Dialog open={open === ModalStateEnum.Open} onOpenChange={(open) => {
      setOpen(open ? ModalStateEnum.Open : ModalStateEnum.Closed);
      if (!open) {
        form.reset();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>
            Add a new track to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Track title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input placeholder="Artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="album"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album</FormLabel>
                  <FormControl>
                    <Input placeholder="Album name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Genres</FormLabel>
              <div className="flex flex-wrap gap-2">
                {form.watch('genres').map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableGenres
                  .filter((genre) => !form.watch('genres').includes(genre))
                  .map((genre) => (
                    <Button
                      key={genre}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddGenre(genre)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      {genre}
                    </Button>
                  ))}
              </div>
              {form.formState.errors.genres && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.genres.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(ModalStateEnum.Closed);
                  form.reset();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Track'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
