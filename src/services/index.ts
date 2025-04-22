import {
  CreateTrackDto,
  QueryParams,
  TracksResponse,
  UpdateTrackDto,
} from '@/types';
import api from '@/lib/axios';
import { AxiosProgressEvent } from 'axios';

export const getTracks = (params?: QueryParams): Promise<TracksResponse> =>
  api.get('/tracks', { params });

export const createTrack = (data: CreateTrackDto) => api.post('/tracks', data);

export const updateTrack = (id: string, data: UpdateTrackDto) =>
  api.put(`/tracks/${id}`, data);

export const deleteTrack = (id: string) => api.delete(`/tracks/${id}`);

export const getGenres = (): Promise<string[]> => api.get('/genres');

export const uploadTrackFile = (
  trackId: string,
  formData: FormData,
  onProgress: (progress: number) => void
) => {
  return api.post(`/tracks/${trackId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      onProgress(progress);
    },
  });
};

export const deleteTrackFile = (trackId: string) =>
  api.delete(`/tracks/${trackId}/file`);
