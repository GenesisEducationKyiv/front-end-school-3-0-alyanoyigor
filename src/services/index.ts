import { CreateTrackDto, QueryParams, TracksResponse, UpdateTrackDto } from '@/types';
import api from '@/lib/axios';

export const getTracks = (params?: QueryParams): Promise<TracksResponse> =>
  api.get('/tracks', { params });

export const createTrack = (data: CreateTrackDto) => api.post('/tracks', data);

export const updateTrack = (id: string, data: UpdateTrackDto) =>
  api.put(`/tracks/${id}`, data);

export const deleteTrack = (id: string) => api.delete(`/tracks/${id}`);

export const uploadTrackFile = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/tracks/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getGenres = (): Promise<string[]> => api.get('/genres');
