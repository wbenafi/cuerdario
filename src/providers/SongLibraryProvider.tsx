import { createContext, useContext, type ReactNode } from 'react';

import { useSongLibrary } from '../hooks/useSongLibrary';

type SongLibraryContextValue = ReturnType<typeof useSongLibrary>;

const SongLibraryContext = createContext<SongLibraryContextValue | null>(null);

export function SongLibraryProvider({ children }: { children: ReactNode }) {
  const value = useSongLibrary();

  return <SongLibraryContext.Provider value={value}>{children}</SongLibraryContext.Provider>;
}

export function useSongLibraryContext() {
  const value = useContext(SongLibraryContext);

  if (!value) {
    throw new Error('useSongLibraryContext must be used inside SongLibraryProvider');
  }

  return value;
}
