export function getDirtyValues<T>(
  dirtyFields: Partial<Record<keyof T, unknown>>,
  values: T
): Partial<T> {
  const dirtyFieldKeys = Object.keys(dirtyFields) as (keyof T)[];

  const dirtyValues = dirtyFieldKeys.reduce((prev, key) => {
    const value = dirtyFields[key];
    if (!value) {
      return prev;
    }

    const isArray = Array.isArray(value);
    const isObject = typeof value === 'object' && !isArray && value !== null;

    const nestedValue = isObject
      ? getDirtyValues(value, values[key])
      : values[key];

    return { ...prev, [key]: isArray ? values[key] : nestedValue };
  }, {});
  return dirtyValues;
}
