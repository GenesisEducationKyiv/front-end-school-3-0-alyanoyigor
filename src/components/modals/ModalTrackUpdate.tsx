import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

import { useGenres, useUpdateTrack } from '@/services/hooks';
import { Track, UpdateTrackDto } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  coverImage: z.string().url('Must be a valid URL').or(z.literal('')),
  genres: z.array(z.string()),
});

interface ModalTrackUpdateProps {
  track: Track;
  children: React.ReactNode;
}

export function ModalTrackUpdate({ track, children }: ModalTrackUpdateProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: updateTrack, isPending } = useUpdateTrack();
  const { data: availableGenres = [] } = useGenres();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  const onSubmit = async (data: UpdateTrackDto) => {
    try {
      await updateTrack({ id: track.id, data });

      toast.success('Success', {
        description: 'Track updated successfully',
      });
      form.reset();
      setIsOpen(false);

      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update track',
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Track</DialogTitle>
          <DialogDescription>
            Update the details for {track.title}.
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
                    <Input placeholder="Image URL (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Genres</FormLabel>
              <div className="flex flex-wrap gap-2">
                {form.watch('genres').map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
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
