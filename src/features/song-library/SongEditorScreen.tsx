import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Icon } from '../../icons';
import { appRoutes, backOrReplace } from '../../navigation/routes';
import { useSongLibraryContext } from '../../providers/SongLibraryProvider';
import { alpha, theme } from '../../theme';
import { editorBackdrop, emptySongDraft, WAVEFORM_VALUES } from './songLibrary.data';
import { getRouteParam } from './songLibrary.utils';
import type { SongDraft } from './songLibrary.types';

export function SongEditorScreen({ mode }: { mode: 'create' | 'edit' }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ songId?: string | string[] }>();
  const { songs, createSong, updateSong } = useSongLibraryContext();
  const songId = getRouteParam(params.songId);
  const initialSong = mode === 'edit' ? songs.find((song) => song.id === songId) ?? null : null;
  const [draft, setDraft] = useState<SongDraft>(emptySongDraft);

  useEffect(() => {
    if (initialSong) {
      setDraft({
        name: initialSong.name,
        artist: initialSong.artist,
        notes: initialSong.notes,
        link: initialSong.link ?? '',
        isFavorite: initialSong.isFavorite,
      });
      return;
    }

    setDraft(emptySongDraft);
  }, [initialSong, mode]);

  if (mode === 'edit' && !initialSong) {
    return (
      <View style={styles.scene}>
        <View style={styles.editorTopBar}>
          <View style={styles.editorTopBarLeft}>
            <Pressable onPress={() => router.replace(appRoutes.library)} style={styles.focusBarButton}>
              <Icon color={theme.colors.onSurfaceVariant} name="close" size={16} />
            </Pressable>
            <Text style={styles.editorTopBarTitle}>Edit Song</Text>
          </View>
        </View>

        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>This draft is no longer available.</Text>
          <Text style={styles.missingText}>
            The song linked by this edit URL was not found in your library.
          </Text>
          <Pressable onPress={() => router.replace(appRoutes.library)} style={styles.returnButton}>
            <Text style={styles.returnButtonLabel}>Return to Library</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const canSave = draft.name.trim().length > 0 && draft.notes.trim().length > 0;

  const updateField = <K extends keyof SongDraft>(key: K, value: SongDraft[K]) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const closeEditor = () => {
    if (mode === 'edit' && initialSong) {
      backOrReplace(router, appRoutes.songDetail(initialSong.id));
      return;
    }

    backOrReplace(router, appRoutes.library);
  };

  const saveSong = () => {
    if (!canSave) {
      return;
    }

    if (mode === 'edit' && initialSong) {
      const updatedSong = updateSong(initialSong.id, draft);
      router.replace(updatedSong ? appRoutes.songDetail(updatedSong.id) : appRoutes.library);
      return;
    }

    const createdSong = createSong(draft);
    router.replace(appRoutes.songDetail(createdSong.id));
  };

  return (
    <View style={styles.scene}>
      <Image source={editorBackdrop} style={styles.editorBackdropImage} />

      <View style={styles.editorTopBar}>
        <View style={styles.editorTopBarLeft}>
          <Pressable onPress={closeEditor} style={styles.focusBarButton}>
            <Icon color={theme.colors.onSurfaceVariant} name="close" size={16} />
          </Pressable>
          <Text style={styles.editorTopBarTitle}>{mode === 'edit' ? 'Edit Song' : 'New Song'}</Text>
        </View>

        <Text style={styles.editorDraftLabel}>Route Saved</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.editorKeyboard}
      >
        <ScrollView contentContainerStyle={styles.editorContent} showsVerticalScrollIndicator={false}>
          <View style={styles.editorHero}>
            <Text style={styles.compositionLabel}>Composition Studio</Text>
            <Text style={styles.editorHeroTitle}>Refine the Resonance</Text>
          </View>

          <EditorField
            label="Song Title"
            onChangeText={(value) => updateField('name', value)}
            placeholder="e.g. Midnight Vibration"
            titleStyle
            value={draft.name}
          />

          <EditorField
            label="Artist / Composer"
            onChangeText={(value) => updateField('artist', value)}
            placeholder="The Resonant Strings"
            value={draft.artist}
          />

          <EditorField
            icon="link"
            label="Reference Link (URL)"
            onChangeText={(value) => updateField('link', value)}
            placeholder="https://recording.session/track"
            value={draft.link ?? ''}
          />

          <View style={styles.editorLyricsHeader}>
            <Text style={styles.editorFieldLabel}>Chords & Lyrics</Text>
            <View style={styles.editorToolRow}>
              <Text style={styles.editorToolText}>BOLD</Text>
              <Text style={styles.editorToolText}>CHORD</Text>
            </View>
          </View>

          <View style={styles.textareaShell}>
            <TextInput
              multiline
              onChangeText={(value) => updateField('notes', value)}
              placeholder="[Am] In the quiet [C] of the room..."
              placeholderTextColor={alpha(theme.colors.outlineVariant, 0.92)}
              style={styles.textarea}
              textAlignVertical="top"
              value={draft.notes}
            />

            <View style={styles.waveformDecoration}>
              {WAVEFORM_VALUES.map((value, index) => (
                <View
                  key={`wave-${index}`}
                  style={[
                    styles.waveformBar,
                    {
                      height: value,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <LinearGradient
          colors={['rgba(19,19,19,0)', 'rgba(19,19,19,0.94)', theme.colors.surface]}
          style={styles.editorActionBar}
        >
          <Pressable onPress={closeEditor} style={styles.cancelButton}>
            <Text style={styles.cancelButtonLabel}>Cancel</Text>
          </Pressable>

          <Pressable
            disabled={!canSave}
            onPress={saveSong}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Icon color={theme.colors.onPrimary} name="save" size={16} />
            <Text style={styles.saveButtonLabel}>Save Masterpiece</Text>
          </Pressable>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

function EditorField({
  icon,
  label,
  onChangeText,
  placeholder,
  titleStyle = false,
  value,
}: {
  icon?: 'link';
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  titleStyle?: boolean;
  value: string;
}) {
  return (
    <View style={styles.editorField}>
      <Text style={styles.editorFieldLabel}>{label}</Text>

      <View style={styles.editorInputShell}>
        {icon ? (
          <View style={styles.editorInputIcon}>
            <Icon color={alpha(theme.colors.outlineVariant, 0.95)} name={icon} size={14} />
          </View>
        ) : null}
        <TextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={alpha(theme.colors.outlineVariant, 0.95)}
          style={[
            styles.editorInput,
            icon ? styles.editorInputWithIcon : null,
            titleStyle ? styles.editorInputTitle : null,
          ]}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  editorBackdropImage: {
    position: 'absolute',
    top: 78,
    right: -32,
    width: 210,
    height: 420,
    opacity: 0.08,
  },
  editorTopBar: {
    height: 64,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editorTopBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  focusBarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorTopBarTitle: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 14,
    color: theme.colors.primary,
  },
  editorDraftLabel: {
    marginRight: 12,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 8,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: alpha(theme.colors.onSurfaceVariant, 0.6),
  },
  editorKeyboard: {
    flex: 1,
  },
  editorContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 146,
  },
  editorHero: {
    marginBottom: 18,
  },
  compositionLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 8,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: theme.colors.onSurfaceVariant,
  },
  editorHeroTitle: {
    marginTop: 2,
    maxWidth: 240,
    fontFamily: theme.fonts.displayStrong,
    fontSize: 38,
    lineHeight: 36,
    color: theme.colors.primary,
  },
  editorField: {
    marginBottom: 16,
    gap: 8,
  },
  editorFieldLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 8,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: theme.colors.onSurface,
  },
  editorInputShell: {
    justifyContent: 'center',
  },
  editorInputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  editorInput: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceLowest,
    fontFamily: theme.fonts.body,
    fontSize: Platform.OS === 'web' ? 16 : 13,
    color: theme.colors.onSurface,
  },
  editorInputWithIcon: {
    paddingLeft: 36,
  },
  editorInputTitle: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 16,
  },
  editorLyricsHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editorToolRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editorToolText: {
    fontFamily: theme.fonts.label,
    fontSize: 8,
    color: theme.colors.secondary,
  },
  textareaShell: {
    minHeight: 264,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceLow,
  },
  textarea: {
    minHeight: 264,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 60,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: Platform.OS === 'web' ? 16 : 13,
    lineHeight: 21,
    color: theme.colors.onSurface,
  },
  waveformDecoration: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    left: 10,
    height: 34,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    opacity: 0.38,
  },
  waveformBar: {
    width: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.secondary,
  },
  editorActionBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cancelButton: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cancelButtonLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
    color: theme.colors.primary,
  },
  saveButton: {
    minWidth: 168,
    height: 58,
    borderRadius: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonLabel: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 15,
    color: theme.colors.onPrimary,
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
