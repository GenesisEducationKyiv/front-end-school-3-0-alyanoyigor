import { z } from 'zod';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  slug: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackDto {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

export interface UpdateTrackDto {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
  audioFile?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: SortField;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}

export interface TracksResponse {
  data: Track[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type TrackFormField = {
  name: keyof CreateTrackDto;
  label: string;
  placeholder: string;
  testId: string;
};

export const SortFieldSchema = z.enum([
  'title',
  'artist',
  'album',
  'createdAt',
]);

export type SortField = z.infer<typeof SortFieldSchema>;
