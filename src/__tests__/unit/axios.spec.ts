import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

describe('api axios instance', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'http://localhost');
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should create axios instance with correct config', async () => {
    const createSpy = vi.spyOn(axios, 'create');
    const expectedConfig = {
      baseURL: 'http://localhost/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    };

    await import('@/lib/axios');

    expect(createSpy).toHaveBeenCalledWith(expectedConfig);

    createSpy.mockRestore();
  });

  it('should return response.data from interceptor', async () => {
    const api = (await import('@/lib/axios')).default;
    const data = { foo: 'bar' };
    const response = api.interceptors.response as unknown as {
      handlers: { fulfilled: (result: unknown) => unknown }[];
    };
    const fulfilled = response.handlers[0].fulfilled;

    const result = fulfilled({ data });

    expect(result).toEqual(data);
  });

  it('should pass error through from interceptor', async () => {
    const api = (await import('@/lib/axios')).default;
    const error = new Error('fail');

    const response = api.interceptors.response as unknown as {
      handlers: { rejected: (error: unknown) => unknown }[];
    };
    const rejected = response.handlers[0].rejected;

    await expect(rejected(error)).rejects.toThrow('fail');
  });
});
