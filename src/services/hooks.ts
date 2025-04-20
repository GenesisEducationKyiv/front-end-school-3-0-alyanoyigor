import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { CreateTrackDto, QueryParams, TracksResponse, UpdateTrackDto } from '@/types';
import { createTrack, deleteTrack, getGenres, getTracks, updateTrack } from './index';

export const useTracks = (page: number = 1, params?: Partial<QueryParams>) => {
  return useQuery<TracksResponse>({
    queryKey: ['tracks', page, params],
    queryFn: () => getTracks({ page, ...params }),
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

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenres(),
  });
};
