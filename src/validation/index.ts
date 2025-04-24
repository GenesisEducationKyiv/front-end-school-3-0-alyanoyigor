import { z } from 'zod';

export const CreateTrackSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  coverImage: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
});

export const UpdateTrackSchema = CreateTrackSchema.partial();
