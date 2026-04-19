import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BottomNav } from '../../components/BottomNav';
import { TopBar } from '../../components/TopBar';
import { TUNER_SIGNAL_MIN, useTuner } from '../../hooks/useTuner';
import { Icon } from '../../icons';
import { appRoutes } from '../../navigation/routes';
import { STANDARD_TUNING, type TuningString } from '../../music';
import { alpha, theme } from '../../theme';
import { TunerDial } from './TunerDial';

export function TunerScreen() {
  const router = useRouter();
  const tuner = useTuner();
  const showPlayNotesRibbonHint =
    tuner.permissionStatus === 'granted' && tuner.amplitude < TUNER_SIGNAL_MIN;

  const ribbonOpacity = useRef(new Animated.Value(showPlayNotesRibbonHint ? 1 : 0)).current;
  const ribbonTranslateY = useRef(new Animated.Value(showPlayNotesRibbonHint ? 0 : 18)).current;

  useEffect(() => {
    const show = showPlayNotesRibbonHint;
    Animated.parallel([
      Animated.timing(ribbonOpacity, {
        toValue: show ? 1 : 0,
        duration: show ? 280 : 200,
        easing: show ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ribbonTranslateY, {
        toValue: show ? 0 : 18,
        duration: show ? 320 : 220,
        easing: show ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [showPlayNotesRibbonHint]);

  const detectedCents = tuner.detectedPitch?.centsToTarget ?? 0;
  const clampedAngle = Math.max(-1, Math.min(1, detectedCents / 50)) * 84;
  const noteFullName = tuner.detectedPitch?.fullName ?? tuner.target.fullName;
  const displayFrequency = tuner.detectedPitch?.frequency ?? tuner.target.frequency;
  const isSignalTooLow = tuner.permissionStatus === 'granted' && tuner.amplitude < TUNER_SIGNAL_MIN;
  const matchesExpectedTune =
    !isSignalTooLow && Boolean(tuner.detectedPitch) && tuner.tuningState === 'in-tune';

  return (
    <View style={styles.scene}>
      <TopBar onTrailingPress={() => router.replace(appRoutes.library)} />

      <ScrollView contentContainerStyle={styles.tunerContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tunerMainColumn}>
          <TunerDial
            angle={isSignalTooLow ? 0 : clampedAngle}
            cents={detectedCents}
            frequency={displayFrequency}
            insufficientSignal={isSignalTooLow}
            matchesExpectedTune={matchesExpectedTune}
            noteFullName={noteFullName}
          />

          <View style={styles.micSection}>
            <View style={styles.micLevelRow}>
              <View style={styles.micLevelTrack}>
                <View
                  style={[
                    styles.micLevelFill,
                    {
                      width: `${Math.max(6, Math.min(100, tuner.amplitude * 100))}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.stringSelector}>
            {STANDARD_TUNING.map((tuningString) => (
              <StringTargetChip
                key={tuningString.id}
                isActive={tuningString.id === tuner.target.id}
                onSelect={() => tuner.setSelectedStringId(tuningString.id)}
                tuningString={tuningString}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Animated.View
        pointerEvents={showPlayNotesRibbonHint ? 'auto' : 'none'}
        style={[
          styles.tunerRibbon,
          {
            opacity: ribbonOpacity,
            transform: [{ translateY: ribbonTranslateY }],
          },
        ]}
      >
        <Icon color={theme.colors.primary} name="mic" size={18} />
        <Text style={styles.tunerRibbonText}>
          Play the notes clearly and let them ring — we need a bit more level from the mic.
        </Text>
      </Animated.View>

      <BottomNav currentTab="tuner" />
    </View>
  );
}

function StringTargetChip({
  isActive,
  onSelect,
  tuningString,
}: {
  isActive: boolean;
  onSelect: () => void;
  tuningString: TuningString;
}) {
  return (
    <Pressable
      accessibilityLabel={`Tune ${tuningString.label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onSelect}
      style={({ pressed }) => [styles.stringChipSlot, pressed && styles.stringChipSlotPressed]}
    >
      <View style={[styles.stringChip, isActive && styles.stringChipActive]}>
        <Text style={[styles.stringChipLetter, isActive && styles.stringChipLetterActive]}>
          {tuningString.note}
        </Text>
      </View>
      <View style={[styles.stringChipDot, isActive ? styles.stringChipDotActive : styles.stringChipDotIdle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  tunerContent: {
    flexGrow: 1,
    width: '100%',
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 152,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tunerMainColumn: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
  },
  targetCopy: {
    alignItems: 'center',
    marginBottom: 24,
  },
  overline: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    letterSpacing: 4,
    color: alpha(theme.colors.onSurfaceVariant, 0.6),
    textTransform: 'uppercase',
  },
  targetTitle: {
    marginTop: 6,
    fontFamily: theme.fonts.displayStrong,
    fontSize: 20,
    color: theme.colors.primary,
  },
  micSection: {
    width: '100%',
    paddingBottom: 18,
    position: 'relative',
    alignItems: 'center',
  },
  micLevelRow: {
    width: '100%',
    alignItems: 'center',
  },
  micLevelTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: alpha(theme.colors.surfaceHighest, 0.1),
  },
  micLevelFill: {
    height: '100%',
    minWidth: 6,
    borderRadius: 999,
    backgroundColor: alpha(theme.colors.secondary, 0.1),
  },
  stringSelector: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 8,
  },
  stringChipSlot: {
    flex: 1,
    minWidth: 0,
    maxWidth: 56,
    alignItems: 'center',
  },
  stringChipSlotPressed: {
    opacity: 0.88,
  },
  stringChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.colors.surfaceHighest, 0.38),
    borderWidth: 1,
    borderColor: alpha(theme.colors.outlineVariant, 0.22),
  },
  stringChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: alpha(theme.colors.primary, 0.95),
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  stringChipLetter: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 16,
    color: alpha(theme.colors.onSurfaceVariant, 0.55),
  },
  stringChipLetterActive: {
    color: theme.colors.onPrimary,
  },
  stringChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  stringChipDotActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  stringChipDotIdle: {
    backgroundColor: 'transparent',
  },
  tunerRibbon: {
    position: 'absolute',
    right: 0,
    bottom: 60,
    left: 0,
    minHeight: 52,
    paddingVertical: 14,
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderColor: alpha(theme.colors.primary, 0.42),
    backgroundColor: alpha(theme.colors.primary, 0.14),
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
  tunerRibbonText: {
    flex: 1,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
    letterSpacing: 0.15,
  },
});
