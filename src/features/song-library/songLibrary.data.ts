import type { ImageSourcePropType } from 'react-native';

import type { Song, SongDraft } from './songLibrary.types';

export const STORAGE_KEY = '@cuerdario/song-library';

export const emptySongDraft: SongDraft = {
  name: '',
  artist: '',
  notes: '',
  link: '',
  isFavorite: false,
};

export const seededSongs: Song[] = [
  {
    id: 'neon-cathedral',
    name: 'Neon Cathedral',
    artist: 'John Mayer',
    notes: `[E] City glow on a midnight wire
[B] Fingers chase the restless fire
[C#m] Hold the chorus, let it breathe
[A] Wait for the room to sing`,
    link: 'https://www.youtube.com/watch?v=32GZ3suxRn4',
    isFavorite: true,
    createdAt: '2026-03-18T08:00:00.000Z',
    updatedAt: '2026-04-02T09:30:00.000Z',
  },
  {
    id: 'blackbird',
    name: 'Blackbird',
    artist: 'The Beatles',
    notes: `[G/B] Blackbird singing in the [A7] dead of night
[G#dim] Take these broken wings and [G] learn to fly`,
    link: 'https://www.youtube.com/watch?v=Man4Xw8Xypo',
    isFavorite: false,
    createdAt: '2026-03-20T10:15:00.000Z',
    updatedAt: '2026-03-30T19:45:00.000Z',
  },
  {
    id: 'slow-dancing',
    name: 'Slow Dancing in a Burning Room',
    artist: 'John Mayer',
    notes: `[C#m] We are [A] slowing down again
[E] Let the silence [B] hold the room`,
    link: 'https://www.youtube.com/watch?v=32GZ3suxRn4',
    isFavorite: true,
    createdAt: '2026-03-22T10:15:00.000Z',
    updatedAt: '2026-04-03T19:45:00.000Z',
  },
  {
    id: 'vultures',
    name: 'Vultures',
    artist: 'John Mayer Trio',
    notes: `[A] Down to the wire and back again
[D] Keep the groove in the pocket`,
    link: '',
    isFavorite: false,
    createdAt: '2026-04-01T06:20:00.000Z',
    updatedAt: '2026-04-03T21:00:00.000Z',
  },
  {
    id: 'gravity',
    name: 'Gravity',
    artist: 'John Mayer',
    notes: `[G] Gravity [D/F#] is working against me
[Em7] Gravity wants to [Cadd9] bring me down`,
    link: '',
    isFavorite: true,
    createdAt: '2026-04-02T06:20:00.000Z',
    updatedAt: '2026-04-04T08:20:00.000Z',
  },
];

export type SongVisual = {
  artwork?: ImageSourcePropType;
  isAcoustic?: boolean;
};

export const songVisuals: Record<string, SongVisual> = {
  'neon cathedral': {
    artwork: require('../../../assets/design/neon-cathedral.jpg'),
  },
  blackbird: {
    artwork: require('../../../assets/design/blackbird.jpg'),
    isAcoustic: true,
  },
  'slow dancing in a burning room': {
    artwork: require('../../../assets/design/slow-dancing.jpg'),
  },
  vultures: {
    artwork: require('../../../assets/design/vultures.jpg'),
  },
  gravity: {
    isAcoustic: true,
  },
  'over the horizon': {},
};

export const editorBackdrop = require('../../../assets/design/editor-backdrop.jpg');

export const WAVEFORM_VALUES = [9, 22, 14, 34, 11, 42, 18, 28, 48, 20, 10];
