/**
 * Core domain entities
 */

import { z } from "zod";

/**
 * Track entity representing a music track in the system
 */
export interface Track {
  /** Unique identifier for the track */
  id: string;
  /** Title of the track */
  title: string;
  /** Artist who created the track */
  artist: string;
  /** Optional album the track belongs to */
  album?: string;
  /** List of genres associated with the track */
  genres: string[];
  /** URL-friendly version of the title (kebab-case) */
  slug: string;
  /** Optional URL to the track's cover image */
  coverImage?: string;
  /** Optional filename of the uploaded audio file */
  audioFile?: string;
  /** ISO timestamp of when the track was created */
  createdAt: string;
  /** ISO timestamp of when the track was last updated */
  updatedAt: string;
}

/**
 * DTOs (Data Transfer Objects)
 */

/**
 * Data required to create a new track
 */
export interface CreateTrackDto {
  /** Title of the track */
  title: string;
  /** Artist who created the track */
  artist: string;
  /** Optional album the track belongs to */
  album?: string;
  /** List of genres associated with the track */
  genres: string[];
  /** Optional URL to the track's cover image */
  coverImage?: string;
}

/**
 * Data for updating an existing track (all fields optional)
 */
export interface UpdateTrackDto {
  /** New title for the track */
  title?: string;
  /** New artist for the track */
  artist?: string;
  /** New album for the track */
  album?: string;
  /** New genres for the track */
  genres?: string[];
  /** New cover image URL for the track */
  coverImage?: string;
  /** New audio file for the track */
  audioFile?: string;
}

/**
 * Query parameters for listing and filtering tracks
 */
export interface QueryParams {
  /** Page number for pagination (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Field to sort results by */
  sort?: SortField;
  /** Sort direction */
  order?: 'asc' | 'desc';
  /** Search term to filter tracks by title, artist, or album */
  search?: string;
  /** Filter tracks by specific genre */
  genre?: string;
  /** Filter tracks by specific artist */
  artist?: string;
}

export interface TrackFormValues {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
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

export const ModalStateSchema = z.enum(['idle', 'open', 'closed']);

export type ModalState = z.infer<typeof ModalStateSchema>;

export type TrackFormField = {
  name: keyof CreateTrackDto;
  label: string;
  placeholder: string;
  testId: string;
};

export const SortFieldSchema = z.enum(['title', 'artist', 'album', 'createdAt']);

export type SortField = z.infer<typeof SortFieldSchema>;
