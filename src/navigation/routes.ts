import type { Router } from 'expo-router';

import type { LibraryFilter } from '../features/song-library/songLibrary.types';

export const appRoutes = {
  tuner: '/tuner',
  library: '/library',
  newSong: '/songs/new',
  songDetail: (songId: string) => `/songs/${songId}`,
  songEdit: (songId: string) => `/songs/${songId}/edit`,
} as const;

export function backOrReplace(router: Router, fallbackHref: string) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackHref);
}

export function buildLibraryParams(filter: LibraryFilter, query: string) {
  const trimmedQuery = query.trim();

  return {
    filter: filter === 'all' ? undefined : filter,
    q: trimmedQuery ? trimmedQuery : undefined,
  };
}
