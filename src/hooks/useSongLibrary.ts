import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { seededSongs, STORAGE_KEY } from '../features/song-library/songLibrary.data';
import { normalizeDraft } from '../features/song-library/songLibrary.utils';
import type { Song, SongDraft } from '../features/song-library/songLibrary.types';

export function useSongLibrary() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadSongs() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSongs(JSON.parse(raw) as Song[]);
        } else {
          setSongs(seededSongs);
        }
      } catch {
        setSongs(seededSongs);
      } finally {
        setIsReady(true);
      }
    }

    void loadSongs();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }, [isReady, songs]);

  const createSong = (draft: SongDraft): Song => {
    const timestamp = new Date().toISOString();
    const normalizedDraft = normalizeDraft(draft);
    const newSong: Song = {
      id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...normalizedDraft,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setSongs((current) => [newSong, ...current]);
    return newSong;
  };

  const updateSong = (songId: string, draft: SongDraft): Song | null => {
    const normalizedDraft = normalizeDraft(draft);
    const timestamp = new Date().toISOString();
    let updatedSong: Song | null = null;

    setSongs((current) =>
      current.map((song) => {
        if (song.id !== songId) {
          return song;
        }

        updatedSong = {
          ...song,
          ...normalizedDraft,
          updatedAt: timestamp,
        };

        return updatedSong;
      })
    );

    return updatedSong;
  };

  const deleteSong = (songId: string) => {
    setSongs((current) => current.filter((song) => song.id !== songId));
  };

  const toggleFavorite = (songId: string) => {
    setSongs((current) =>
      current.map((song) =>
        song.id === songId
          ? {
              ...song,
              isFavorite: !song.isFavorite,
              updatedAt: new Date().toISOString(),
            }
          : song
      )
    );
  };

  return {
    songs,
    isReady,
    createSong,
    updateSong,
    deleteSong,
    toggleFavorite,
  };
}
