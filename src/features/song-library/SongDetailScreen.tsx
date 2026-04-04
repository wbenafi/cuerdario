import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Icon } from '../../icons';
import { appRoutes, backOrReplace } from '../../navigation/routes';
import { useSongLibraryContext } from '../../providers/SongLibraryProvider';
import { alpha, theme } from '../../theme';
import { getRouteParam, openSongLink } from './songLibrary.utils';

export function SongDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ songId?: string | string[] }>();
  const { songs } = useSongLibraryContext();
  const songId = getRouteParam(params.songId);
  const song = songs.find((entry) => entry.id === songId) ?? null;

  if (!song) {
    return (
      <View style={styles.scene}>
        <View style={styles.focusTopBar}>
          <Pressable
            onPress={() => backOrReplace(router, appRoutes.library)}
            style={styles.focusBarButton}
          >
            <Icon color={theme.colors.onSurface} name="back" size={20} />
          </Pressable>

          <Text style={styles.focusBarTitle}>Song Missing</Text>
          <View style={styles.focusBarSpacer} />
        </View>

        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>This song could not be found.</Text>
          <Text style={styles.missingText}>
            It may have been removed from the library, or the URL is out of date.
          </Text>
          <Pressable onPress={() => router.replace(appRoutes.library)} style={styles.returnButton}>
            <Text style={styles.returnButtonLabel}>Return to Library</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const canOpenLink = Boolean(song.link);

  return (
    <View style={styles.scene}>
      <View style={styles.focusTopBar}>
        <Pressable
          onPress={() => backOrReplace(router, appRoutes.library)}
          style={styles.focusBarButton}
        >
          <Icon color={theme.colors.onSurface} name="back" size={20} />
        </Pressable>

        <Text style={styles.focusBarTitle}>Reading View</Text>

        <Pressable onPress={() => router.push(appRoutes.songEdit(song.id))} style={styles.focusEditButton}>
          <Text style={styles.focusEditLabel}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
        <View style={styles.detailHero}>
          <Text style={styles.detailSongTitle}>{song.name}</Text>
          <Text style={styles.detailSongArtist}>{song.artist}</Text>

        </View>

        <View style={styles.detailLyricsCard}>
          <ChordText text={song.notes} />
        </View>

        <Pressable
          disabled={!canOpenLink}
          onPress={() => void openSongLink(song.link ?? '')}
          style={[styles.externalLinkButton, !canOpenLink && styles.externalLinkButtonDisabled]}
        >
          <Icon color={theme.colors.secondary} name="link" size={15} />
          <Text style={styles.externalLinkLabel}>
            {canOpenLink ? 'Open External Link' : 'No External Link'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ChordText({ text }: { text: string }) {
  const value = text.trim() || '[Am] In the quiet [C] of the room...';
  const parts = value.split(/(\[[^\]]+\])/g).filter(Boolean);

  return (
    <Text style={styles.chordText}>
      {parts.map((part, index) => (
        <Text
          key={`part-${index}`}
          style={part.startsWith('[') ? styles.chordAccent : undefined}
        >
          {part}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  focusTopBar: {
    height: 64,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusBarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: theme.fonts.displayStrong,
    fontSize: 18,
    color: theme.colors.onSurface,
  },
  focusBarSpacer: {
    width: 44,
  },
  focusEditButton: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusEditLabel: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 14,
    color: theme.colors.primary,
  },
  detailContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 32,
  },
  detailHero: {
    gap: 8,
  },
  detailSongTitle: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 26,
    lineHeight: 32,
    color: theme.colors.primary,
  },
  detailSongArtist: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 18,
    color: theme.colors.secondary,
  },
  detailLyricsCard: {
    marginTop: 22,
    minHeight: 242,
    borderRadius: 6,
    padding: 18,
    backgroundColor: theme.colors.surfaceLowest,
  },
  chordText: {
    fontFamily: theme.fonts.body,
    fontSize: 16,
    lineHeight: 29,
    color: theme.colors.onSurface,
  },
  chordAccent: {
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.primary,
  },
  externalLinkButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceHigh,
  },
  externalLinkButtonDisabled: {
    opacity: 0.6,
  },
  externalLinkLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
    color: theme.colors.onSurface,
  },
  missingState: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  missingTitle: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 24,
    color: theme.colors.onSurface,
  },
  missingText: {
    maxWidth: 280,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: alpha(theme.colors.onSurfaceVariant, 0.82),
  },
  returnButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
  },
  returnButtonLabel: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 14,
    color: theme.colors.onPrimary,
  },
});
