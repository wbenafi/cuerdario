import { startTransition, useDeferredValue, useMemo } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BottomNav } from '../../components/BottomNav';
import { FilterChip } from '../../components/FilterChip';
import { TopBar } from '../../components/TopBar';
import { Icon } from '../../icons';
import { appRoutes, buildLibraryParams } from '../../navigation/routes';
import { useSongLibraryContext } from '../../providers/SongLibraryProvider';
import { alpha, theme } from '../../theme';
import { filterSongs, getRouteParam, getSongVisual, parseLibraryFilter } from './songLibrary.utils';
import type { LibraryFilter, Song } from './songLibrary.types';

export function LibraryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string | string[]; q?: string | string[] }>();
  const { songs, toggleFavorite } = useSongLibraryContext();
  const filter = parseLibraryFilter(params.filter);
  const query = getRouteParam(params.q);
  const deferredQuery = useDeferredValue(query);
  const filteredSongs = useMemo(() => {
    return filterSongs(songs, filter, deferredQuery);
  }, [deferredQuery, filter, songs]);

  const updateParams = (nextFilter: LibraryFilter, nextQuery: string) => {
    startTransition(() => {
      router.setParams(buildLibraryParams(nextFilter, nextQuery));
    });
  };

  return (
    <View style={styles.scene}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.libraryContent} showsVerticalScrollIndicator={false}>
        <View style={styles.searchField}>
          <Icon color={alpha(theme.colors.onSurfaceVariant, 0.8)} name="search" size={14} />
          <TextInput
            onChangeText={(value) => updateParams(filter, value)}
            placeholder="Search your repertoire..."
            placeholderTextColor={alpha(theme.colors.onSurfaceVariant, 0.55)}
            style={styles.searchInput}
            value={query}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.filterRow}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <FilterChip active={filter === 'all'} label="All Songs" onPress={() => updateParams('all', query)} />
          <FilterChip active={filter === 'recent'} label="Recent" onPress={() => updateParams('recent', query)} />
          <FilterChip
            active={filter === 'favorites'}
            label="Favorites"
            onPress={() => updateParams('favorites', query)}
          />
          <FilterChip
            active={filter === 'acoustic'}
            label="Acoustic"
            onPress={() => updateParams('acoustic', query)}
          />
        </ScrollView>

        <View style={styles.collectionHeader}>
          <Text style={styles.collectionLabel}>Your Collection</Text>
          <Text style={styles.collectionCount}>{`${filteredSongs.length} TRACKS`}</Text>
        </View>

        <View style={styles.songList}>
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                onOpen={() => router.push(appRoutes.songDetail(song.id))}
                onToggleFavorite={() => toggleFavorite(song.id)}
                song={song}
              />
            ))
          ) : (
            <View style={styles.emptyLibraryCard}>
              <Text style={styles.emptyLibraryTitle}>No songs match this filter.</Text>
              <Text style={styles.emptyLibraryText}>
                Try another filter or start a new entry from the add button.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Pressable onPress={() => router.push(appRoutes.newSong)} style={styles.fab}>
        <Icon color={theme.colors.onPrimary} name="plus" size={28} />
      </Pressable>

      <BottomNav currentTab="library" />
    </View>
  );
}

function SongCard({
  onOpen,
  onToggleFavorite,
  song,
}: {
  onOpen: () => void;
  onToggleFavorite: () => void;
  song: Song;
}) {
  const visual = getSongVisual(song);

  const toggleFavorite = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleFavorite();
  };

  return (
    <Pressable onPress={onOpen} style={styles.songCard}>
      <View style={styles.songCardMain}>
        <View style={styles.songCardArtwork}>
          {visual.artwork ? (
            <Image source={visual.artwork} style={styles.songCardArtworkImage} />
          ) : (
            <View style={styles.songCardArtworkFallback}>
              <Icon color={alpha(theme.colors.onSurfaceVariant, 0.8)} name="music-note" size={18} />
            </View>
          )}
        </View>

        <View style={styles.songCardCopy}>
          <Text numberOfLines={2} style={styles.songCardTitle}>
            {song.name}
          </Text>
          <Text numberOfLines={1} style={styles.songCardArtist}>
            {song.artist}
          </Text>
        </View>

        <View style={styles.songCardMeta}>
          <Pressable hitSlop={12} onPress={toggleFavorite} style={styles.favoriteButton}>
            <Icon
              color={song.isFavorite ? theme.colors.primary : alpha(theme.colors.outlineVariant, 0.95)}
              name={song.isFavorite ? 'heart-filled' : 'heart'}
              size={18}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  libraryContent: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 138,
  },
  searchField: {
    height: 56,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surfaceLow,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fonts.body,
    fontSize: Platform.OS === 'web' ? 16 : 13,
    color: theme.colors.onSurface,
  },
  filterRow: {
    gap: 8,
    paddingVertical: 14,
  },
  collectionHeader: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectionLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: theme.colors.onSurface,
  },
  collectionCount: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 8,
    color: alpha(theme.colors.onSurfaceVariant, 0.6),
  },
  songList: {
    gap: 12,
  },
  songCard: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.surfaceLow,
  },
  songCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  songCardArtwork: {
    width: 46,
    height: 46,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceHighest,
  },
  songCardArtworkImage: {
    width: '100%',
    height: '100%',
  },
  songCardArtworkFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songCardCopy: {
    flex: 1,
    gap: 2,
  },
  songCardTitle: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 15,
    lineHeight: 18,
    color: theme.colors.onSurface,
  },
  songCardArtist: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 10,
    color: theme.colors.onSurface,
  },
  songCardMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 92,
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  emptyLibraryCard: {
    padding: 18,
    borderRadius: 14,
    gap: 8,
    backgroundColor: theme.colors.surfaceLow,
  },
  emptyLibraryTitle: {
    fontFamily: theme.fonts.display,
    fontSize: 20,
    color: theme.colors.onSurface,
  },
  emptyLibraryText: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.onSurfaceVariant,
  },
});
