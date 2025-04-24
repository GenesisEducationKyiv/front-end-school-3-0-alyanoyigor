import {
  CreateTrackDto,
  QueryParams,
  Track,
  TracksResponse,
  UpdateTrackDto,
} from '@/types';
import api from '@/lib/axios';

export const getTracks = (params?: QueryParams): Promise<TracksResponse> =>
  api.get('/tracks', { params });

export const createTrack = async (data: CreateTrackDto): Promise<Track> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return api.post('/tracks', data);
};

export const updateTrack = async (id: string, data: UpdateTrackDto) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return api.put(`/tracks/${id}`, data);
};

export const deleteTrack = (id: string) => api.delete(`/tracks/${id}`);

export const getGenres = (): Promise<string[]> => api.get('/genres');

export const uploadTrackFile = (trackId: string, formData: FormData) => {
  return api.post(`/tracks/${trackId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTrackFile = (trackId: string) =>
  api.delete(`/tracks/${trackId}/file`);
