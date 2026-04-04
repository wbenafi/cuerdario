import { Linking } from 'react-native';

import { songVisuals, type SongVisual } from './songLibrary.data';
import type { LibraryFilter, Song, SongDraft } from './songLibrary.types';

export function normalizeDraft(draft: SongDraft): SongDraft {
  return {
    name: draft.name.trim(),
    artist: draft.artist.trim() || 'Unknown Artist',
    notes: draft.notes.trim(),
    link: draft.link?.trim() || '',
    isFavorite: draft.isFavorite,
  };
}

export function normalizeTitle(value: string) {
  return value.trim().toLowerCase();
}

export function getSongVisual(song: Song): SongVisual {
  return songVisuals[normalizeTitle(song.name)] ?? {};
}

export function filterSongs(songs: Song[], filter: LibraryFilter, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  let nextSongs = [...songs];

  if (filter === 'recent') {
    nextSongs.sort((left, right) => {
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });
  }

  if (filter === 'favorites') {
    nextSongs = nextSongs.filter((song) => song.isFavorite);
  }

  if (filter === 'acoustic') {
    nextSongs = nextSongs.filter((song) => getSongVisual(song).isAcoustic);
  }

  if (!normalizedQuery) {
    return nextSongs;
  }

  return nextSongs.filter((song) => {
    return (
      song.name.toLowerCase().includes(normalizedQuery) ||
      song.artist.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function parseLibraryFilter(value: string | string[] | undefined): LibraryFilter {
  const resolved = getRouteParam(value);

  if (
    resolved === 'recent' ||
    resolved === 'favorites' ||
    resolved === 'acoustic' ||
    resolved === 'all'
  ) {
    return resolved;
  }

  return 'all';
}

export function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export async function openSongLink(link: string) {
  if (!link) {
    return;
  }

  const normalized =
    link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;

  await Linking.openURL(normalized);
}
