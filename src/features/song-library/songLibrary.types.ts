export type Song = {
  id: string;
  name: string;
  artist: string;
  notes: string;
  link?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SongDraft = {
  name: string;
  artist: string;
  notes: string;
  link?: string;
  isFavorite: boolean;
};

export type LibraryFilter = 'all' | 'recent' | 'favorites' | 'acoustic';
