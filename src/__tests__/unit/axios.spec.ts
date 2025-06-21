import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

describe('api axios instance', () => {
  // Mock import.meta.env
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'http://localhost');
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should create axios instance with correct config', async () => {
    // Arrange
    const createSpy = vi.spyOn(axios, 'create');
    const expectedConfig = {
      baseURL: 'http://localhost/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    };

    // Act
    // Re-import to trigger instance creation with mocked env
    await import('@/lib/axios');

    // Assert
    expect(createSpy).toHaveBeenCalledWith(expectedConfig);

    createSpy.mockRestore();
  });

  it('should return response.data from interceptor', async () => {
    // Arrange
    const api = (await import('@/lib/axios')).default;
    const data = { foo: 'bar' };
    const response = api.interceptors.response as unknown as {
      handlers: { fulfilled: (result: unknown) => unknown }[];
    };
    const fulfilled = response.handlers[0].fulfilled;

    // Act
    const result = fulfilled({ data });

    // Assert
    expect(result).toEqual(data);
  });

  it('should pass error through from interceptor', async () => {
    // Arrange
    const api = (await import('@/lib/axios')).default;
    const error = new Error('fail');

    const response = api.interceptors.response as unknown as {
      handlers: { rejected: (error: unknown) => unknown }[];
    };
    const rejected = response.handlers[0].rejected;

    // Act
    // Assert
    await expect(rejected(error)).rejects.toThrow('fail');
  });
});
