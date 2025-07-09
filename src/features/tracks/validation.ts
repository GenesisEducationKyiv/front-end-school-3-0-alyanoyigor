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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/x-m4a',
];

export const UploadTrackSchema = z.object({
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

export type UploadTrackFormData = z.infer<typeof UploadTrackSchema>;

export const UpdateTrackSchema = CreateTrackSchema.partial();
