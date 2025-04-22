import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import {
  CreateTrackDto,
  QueryParams,
  TracksResponse,
  UpdateTrackDto,
} from '@/types';
import {
  createTrack,
  deleteTrack,
  deleteTrackFile,
  getGenres,
  getTracks,
  updateTrack,
  uploadTrackFile,
} from './index';

export const useTracks = (params?: Partial<QueryParams>) => {
  return useQuery<TracksResponse>({
    queryKey: ['tracks', params],
    queryFn: () => getTracks({ ...params }),
    placeholderData: keepPreviousData,
  });
};

export const useCreateTrack = () => {
  return useMutation({
    mutationFn: (data: CreateTrackDto) => createTrack(data),
  });
};

export const useUpdateTrack = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrackDto }) =>
      updateTrack(id, data),
  });
};

export const useDeleteTrack = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTrack(id),
  });
};

// TODO: Issue with multiple genre call in network
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenres(),
    // staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useUploadTrackFile = () => {
  return useMutation({
    mutationFn: async ({
      trackId,
      formData,
      onProgress,
    }: {
      trackId: string;
      formData: FormData;
      onProgress: (progress: number) => void;
    }) => {
      return uploadTrackFile(trackId, formData, onProgress);
    },
  });
};

export const useDeleteTrackFile = () => {
  return useMutation({
    mutationFn: async (trackId: string) => deleteTrackFile(trackId),
  });
};
