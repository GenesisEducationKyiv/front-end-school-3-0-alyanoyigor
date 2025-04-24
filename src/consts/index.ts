import { TrackFormField } from "@/types";

export const sortFieldOptions = {
  title: 'Title',
  artist: 'Artist',
  album: 'Album',
  createdAt: 'Date Added',
};

/**
 * Fields for the track form
 */
export const trackFormFields: TrackFormField[] = [
  {
    name: 'title',
    label: 'Title',
    placeholder: 'Track title',
    testId: 'title',
  },
  {
    name: 'artist',
    label: 'Artist',
    placeholder: 'Artist name',
    testId: 'artist',
  },
  {
    name: 'album',
    label: 'Album',
    placeholder: 'Album name (optional)',
    testId: 'album',
  },
  {
    name: 'coverImage',
    label: 'Cover Image URL',
    placeholder: 'https://example.com/image.jpg',
    testId: 'cover-image',
  },
];
