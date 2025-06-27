import {
  CreateTrackDto,
  QueryParams,
  Track,
  TracksResponse,
  UpdateTrackDto,
} from '@/types';
import api from '@/lib/axios';

export const getTracks = async (
  params?: QueryParams
): Promise<TracksResponse> => {
  const query = /* GraphQL */ `
    query Tracks($params: TracksQueryParams) {
      tracks(params: $params) {
        data {
          id
          title
          artist
          album
          genres
          slug
          coverImage
          audioFile
          createdAt
          updatedAt
        }
        meta {
          total
          page
          limit
          totalPages
        }
      }
    }
  `;

  const response = await api.post<{ tracks: TracksResponse }>('/graphql', {
    query,
    variables: { params },
  });

  return response.data.tracks;
};

export const createTrack = async (data: CreateTrackDto) => {
  const query = /* GraphQL */ `
    mutation AddTrack($data: AddTrackInput) {
      addTrack(data: $data) {
        id
        title
        artist
        album
        genres
        slug
        coverImage
        createdAt
        updatedAt
      }
    }
  `;

  const response = await api.post<{ addTrack: Track }>('/graphql', {
    query,
    variables: { data },
  });

  return response.data.addTrack;
};

export const updateTrack = async (id: string, data: UpdateTrackDto) => {
  const query = /* GraphQL */ `
    mutation UpdateTrack($id: ID, $data: UpdateTrackInput) {
      updateTrack(id: $id, data: $data) {
        id
        title
        artist
        album
        genres
        slug
        coverImage
        audioFile
        createdAt
        updatedAt
      }
    }
  `;

  const response = await api.post<{ updateTrack: Track }>('/graphql', {
    query,
    variables: { id, data },
  });

  return response.data.updateTrack;
};

export const deleteTrack = async (id: string) => {
  const query = /* GraphQL */ `
    mutation DeleteTrack($id: ID) {
      deleteTrack(id: $id)
    }
  `;

  const response = await api.post<{ deleteTrack: boolean }>('/graphql', {
    query,
    variables: { id },
  });

  return response.data.deleteTrack;
};

export const deleteTrackFile = async (id: string) => {
  const query = /* GraphQL */ `
    mutation DeleteTrackFile($id: ID) {
      deleteTrackFile(id: $id) {
        id
        title
        artist
        album
        genres
        slug
        coverImage
        audioFile
        createdAt
        updatedAt
      }
    }
  `;

  const response = await api.post<{ deleteTrackFile: boolean }>('/graphql', {
    query,
    variables: { id },
  });

  return response.data.deleteTrackFile;
};

export const uploadTrackFile = async (id: string, file: File) => {
  const formData = new FormData();

  formData.append(
    'operations',
    JSON.stringify({
      query: `
        mutation UploadTrackFile($id: ID, $file: Upload) {
          uploadTrackFile(id: $id, file: $file) {
            id
            title
            artist
            album
            genres
            slug
            coverImage
            audioFile
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id,
        file: null,
      },
    })
  );

  formData.append('map', JSON.stringify({ '0': ['variables.file'] }));

  formData.append('0', file);

  const response = await api.post('/graphql', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.uploadTrackFile;
};

export const getGenres = async () => {
  const query = /* GraphQL */ `
    query Genres {
      genres
    }
  `;

  const response = await api.post<{ genres: string[] }>('/graphql', {
    query,
  });

  return response.data.genres;
};
