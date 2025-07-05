import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { O } from '@mobily/ts-belt';

import { TrackList } from '@/components/track/TrackList';
import { Track } from '@/types';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Test Genre'],
  slug: 'test-track',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const server = setupServer(
  http.get('*/tracks', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    if (page === '2') {
      return HttpResponse.json({
        data: [{ ...mockTrack, id: '2', title: 'Second Page Track' }],
        meta: { page: 2, perPage: 5, totalPages: 2, totalItems: 10 },
      });
    }
    return HttpResponse.json({
      data: [mockTrack],
      meta: { page: 1, perPage: 5, totalPages: 1, totalItems: 1 },
    });
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AudioPlayerProvider>{children}</AudioPlayerProvider>
    </QueryClientProvider>
  );
};

const defaultProps = {
  page: O.Some(1),
  sortField: O.Some('title' as const),
  debouncedSearchTerm: O.None,
  selectedGenre: O.None,
  setPage: vi.fn(),
  genres: ['Test Genre'],
};

describe('TrackList', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should show loading skeleton when fetching tracks', () => {
    server.use(
      http.get('*/tracks', async () => {
        await delay('infinite');
        return new HttpResponse(null);
      })
    );

    render(<TrackList {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('loading-tracks')).toBeInTheDocument();
  });

  it('should show error message on API error', async () => {
    server.use(
      http.get('*/tracks', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<TrackList {...defaultProps} />, { wrapper: createWrapper() });

    expect(
      await screen.findByTestId('error-loading-tracks')
    ).toBeInTheDocument();
  });

  it('should render tracks on successful fetch', async () => {
    render(<TrackList {...defaultProps} />, { wrapper: createWrapper() });

    expect(await screen.findByTestId('track-item-1')).toBeInTheDocument();
  });

  it('should render pagination if totalPages > 1', async () => {
    server.use(
      http.get('*/tracks', () => {
        return HttpResponse.json({
          data: [mockTrack],
          meta: { page: 1, perPage: 5, totalPages: 2, totalItems: 10 },
        });
      })
    );

    render(<TrackList {...defaultProps} />, { wrapper: createWrapper() });

    expect(await screen.findByTestId('pagination')).toBeInTheDocument();
  });

  it('should not render pagination if totalPages <= 1', async () => {
    render(<TrackList {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  it('should not include parameters when they are None', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/tracks', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json({
          data: [mockTrack],
          meta: { page: 1, perPage: 5, totalPages: 1, totalItems: 1 },
        });
      })
    );

    render(<TrackList {...defaultProps} sortField={O.None} />, {
      wrapper: createWrapper(),
    });

    await screen.findByTestId('track-item-1');
    const url = new URL(requestUrl);

    expect(url.searchParams.has('page')).toBe(false);
    expect(url.searchParams.has('sort')).toBe(false);
    expect(url.searchParams.has('search')).toBe(false);
    expect(url.searchParams.has('genre')).toBe(false);
  });
});
