export const emptyContentSlug = '__empty__';

export function withEmptyContentFallback<T>(params: T[], fallback: T): T[] {
  return params.length > 0 ? params : [fallback];
}
