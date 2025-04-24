import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrackDto) => createTrack(data),
    mutationKey: ['add-track'],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tracks'] }),
  });
};

export const useUpdateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrackDto }) =>
      updateTrack(id, data),
    mutationKey: ['update-track'],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tracks'] }),
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

export const useUploadTrackFile = () => {
  return useMutation({
    mutationFn: async ({
      trackId,
      formData,
    }: {
      trackId: string;
      formData: FormData;
    }) => {
      return uploadTrackFile(trackId, formData);
    },
  });
};

export const useDeleteTrackFile = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTrackFile(id),
  });
};
