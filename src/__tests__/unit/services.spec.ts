import { describe, it, expect, vi, afterEach, Mock } from 'vitest';
import * as services from '@/services';
import api from '@/lib/axios';
import type {
  CreateTrackDto,
  UpdateTrackDto,
  QueryParams,
  Track,
  TracksResponse,
} from '@/types';

vi.mock('@/lib/axios');

const mockedApi = api as unknown as Record<string, unknown>;

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  genres: ['rock'],
  slug: 'test-track',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockTracksResponse: TracksResponse = {
  data: [mockTrack],
  meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
};

describe('services', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getTracks calls api.get with correct params', async () => {
    (mockedApi.get as Mock).mockResolvedValueOnce(mockTracksResponse);
    const params: QueryParams = { page: 1, limit: 10 };

    const result = await services.getTracks(params);

    expect(mockedApi.get).toHaveBeenCalledWith('/tracks', { params });
    expect(result).toBe(mockTracksResponse);
  });

  it('createTrack calls api.post with correct data', async () => {
    const dto: CreateTrackDto = { title: 'A', artist: 'B', genres: ['rock'] };
    (mockedApi.post as Mock).mockResolvedValueOnce(mockTrack);

    const result = await services.createTrack(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/tracks', dto);
    expect(result).toBe(mockTrack);
  });

  it('updateTrack calls api.put with correct id and data', async () => {
    const dto: UpdateTrackDto = { title: 'New' };
    (mockedApi.put as Mock).mockResolvedValueOnce(mockTrack);

    const result = await services.updateTrack('1', dto);

    expect(mockedApi.put).toHaveBeenCalledWith('/tracks/1', dto);
    expect(result).toBe(mockTrack);
  });

  it('deleteTrack calls api.delete with correct id', async () => {
    (mockedApi.delete as Mock).mockResolvedValueOnce({});

    const result = await services.deleteTrack('1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/tracks/1');
    expect(result).toEqual({});
  });

  it('getGenres calls api.get with /genres', async () => {
    const genres = ['rock', 'pop'];
    (mockedApi.get as Mock).mockResolvedValueOnce(genres);

    const result = await services.getGenres();

    expect(mockedApi.get).toHaveBeenCalledWith('/genres');
    expect(result).toEqual(genres);
  });

  it('uploadTrackFile calls api.post with correct args', async () => {
    const formData = new FormData();
    (mockedApi.post as Mock).mockResolvedValueOnce({});

    const result = await services.uploadTrackFile('1', formData);

    expect(mockedApi.post).toHaveBeenCalledWith('/tracks/1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    expect(result).toEqual({});
  });

  it('deleteTrackFile calls api.delete with correct url', async () => {
    (mockedApi.delete as Mock).mockResolvedValueOnce({});

    const result = await services.deleteTrackFile('1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/tracks/1/file');
    expect(result).toEqual({});
  });
});
