import { getDirtyValues } from '@/lib/getDirtyValues';
import { expect, describe, it } from 'vitest';

describe('getDirtyValues', () => {
  it('should return values that are changed', () => {
    // Arrange
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

    // Assert
    const changedValues = getDirtyValues(dirtyFieldFlags, data);

    // Act
    expect(changedValues).toEqual(expectedData);
  });

  it('should return empty object if no values are changed', () => {
    // Arrange
    const data = {
      id: '1',
      title: 'A',
    };
    const dirtyFieldFlags = {};
    const expectedData = {};

    // Assert
    const changedValues = getDirtyValues(dirtyFieldFlags, data);

    // Act
    expect(changedValues).toEqual(expectedData);
  });

  it('should return empty object when dirty fields reference non-existent data properties', () => {
    // Arrange
    const data = {
      id: '1',
      title: 'A',
    };
    const dirtyFieldFlags = {
      age: true,
    };
    const expectedData = {};

    // Assert
    const changedValues = getDirtyValues(
      dirtyFieldFlags as Record<string, unknown>,
      data
    );

    // Act
    expect(changedValues).toEqual(expectedData);
  });
});
