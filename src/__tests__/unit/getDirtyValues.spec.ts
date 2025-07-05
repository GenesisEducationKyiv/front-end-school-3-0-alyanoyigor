import { getDirtyValues } from '@/lib/getDirtyValues';
import { expect, describe, it } from 'vitest';

describe('getDirtyValues', () => {
  it('should return values that are changed', () => {
    const data = {
      id: '1',
      title: 'A',
    };
    const dirtyFieldFlags = {
      title: true,
      id: false,
    };
    const expectedData = {
      title: 'A',
    };

    const changedValues = getDirtyValues(dirtyFieldFlags, data);

    expect(changedValues).toEqual(expectedData);
  });

  it('should return empty object if no values are changed', () => {
    const data = {
      id: '1',
      title: 'A',
    };
    const dirtyFieldFlags = {};
    const expectedData = {};

    const changedValues = getDirtyValues(dirtyFieldFlags, data);

    expect(changedValues).toEqual(expectedData);
  });

  it('should return empty object when dirty fields reference non-existent data properties', () => {
    const data = {
      id: '1',
      title: 'A',
    };
    const dirtyFieldFlags = {
      age: true,
    };
    const expectedData = {};

    const changedValues = getDirtyValues(
      dirtyFieldFlags as Record<string, unknown>,
      data
    );

    expect(changedValues).toEqual(expectedData);
  });
});
