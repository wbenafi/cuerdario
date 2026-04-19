import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { alpha, theme } from '../../theme';

const EMPTY_READING = '—';

/** Matches `tuningStateFromCents` in `music.ts` — ±this many cents is “in tune”. */
const IN_TUNE_CENTS = 4;
/** Same scale as `TunerScreen` needle: ±50 cents → ±84°. */
const DIAL_MAX_CENTS = 50;
const DIAL_MAX_NEEDLE_DEG = 84;
/** Interpolation bounds kept wider than ±84° so incoming values clamp gracefully. */
const NEEDLE_ANGLE_INTERPOLATE = DIAL_MAX_NEEDLE_DEG + 20;
const NEEDLE_ANIMATION_MS = 320;

export function TunerDial({
  angle,
  cents,
  frequency,
  insufficientSignal,
  matchesExpectedTune,
  noteFullName,
}: {
  angle: number;
  cents: number;
  frequency: number;
  insufficientSignal?: boolean;
  /** In-tune on the target string — full needle and note emphasis. */
  matchesExpectedTune: boolean;
  /** e.g. `E2`, `G#3` — letter is large, trailing octave digit(s) smaller. */
  noteFullName: string;
}) {
  const { noteLetters, noteOctave } = splitNoteName(noteFullName);

  const needleRotation = useRef(new Animated.Value(angle)).current;
  useEffect(() => {
    Animated.timing(needleRotation, {
      toValue: angle,
      duration: NEEDLE_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [angle, needleRotation]);

  const needleRotate = needleRotation.interpolate({
    inputRange: [-NEEDLE_ANGLE_INTERPOLATE, NEEDLE_ANGLE_INTERPOLATE],
    outputRange: [`-${NEEDLE_ANGLE_INTERPOLATE}deg`, `${NEEDLE_ANGLE_INTERPOLATE}deg`],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.dialCard}>
      <View style={styles.dialFrame}>
        <View style={styles.dialFrameBorder} />
        <View style={styles.dialFrameInnerBorder} />
        <Svg height={292} style={styles.dialSvg} viewBox="0 0 292 292" width={292}>
          <Path
            d={inTuneZonePath(
              146,
              146,
              103,
              114,
              (IN_TUNE_CENTS / DIAL_MAX_CENTS) * DIAL_MAX_NEEDLE_DEG,
            )}
            fill={alpha(theme.colors.primary, 0.11)}
          />
          <Line
            stroke={alpha(theme.colors.primary, 0.38)}
            strokeLinecap="round"
            strokeWidth={1.6}
            {...radialSegment(146, 146, 100, 116, 0)}
          />
          {Array.from({ length: 37 }, (_, index) => {
            const currentAngle = -112 + index * (224 / 36);
            const majorTick = index % 4 === 0;
            const start = polarToCartesian(146, 146, majorTick ? 104 : 109, currentAngle);
            const end = polarToCartesian(146, 146, 114, currentAngle);

            return (
              <Line
                key={`tick-${currentAngle}`}
                stroke={alpha(theme.colors.outlineVariant, majorTick ? 0.42 : 0.18)}
                strokeLinecap="round"
                strokeWidth={majorTick ? 1.4 : 0.8}
                x1={start.x}
                x2={end.x}
                y1={start.y}
                y2={end.y}
              />
            );
          })}
        </Svg>

        <Text style={styles.dialTopLabel}>TUNED</Text>
        <Text style={styles.dialSideLabelLeft}>-50C</Text>
        <Text style={styles.dialSideLabelRight}>+50C</Text>

        <Animated.View
          style={[
            styles.dialNeedle,
            insufficientSignal && styles.dialNeedleMuted,
            !insufficientSignal && !matchesExpectedTune && styles.dialNeedleOffTarget,
            { transform: [{ rotate: needleRotate }] },
          ]}
        />

        <View style={styles.dialCenter}>
          {insufficientSignal ? (
            <Text style={[styles.dialNote, styles.dialNoteMuted]}>{EMPTY_READING}</Text>
          ) : (
            <View style={styles.dialNoteRow}>
              <Text
                style={[
                  styles.dialNote,
                  !matchesExpectedTune && styles.dialNoteOffTarget,
                ]}
              >
                {noteLetters}
              </Text>
              {noteOctave ? (
                <Text
                  style={[
                    styles.dialNoteOctave,
                    !matchesExpectedTune && styles.dialNoteOctaveOffTarget,
                  ]}
                >
                  {noteOctave}
                </Text>
              ) : null}
            </View>
          )}

          <View style={styles.dialReadoutRow}>
            <View style={styles.dialReadout}>
              <Text style={styles.dialReadoutLabel}>FREQ</Text>
              <View style={styles.dialFreqValueRow}>
                <Text style={[styles.dialReadoutValue, insufficientSignal && styles.dialReadoutMuted]}>
                  {insufficientSignal ? EMPTY_READING : frequency.toFixed(1)}
                </Text>
                {insufficientSignal ? null : <Text style={styles.dialReadoutUnit}>Hz</Text>}
              </View>
            </View>

            <View style={styles.dialDivider} />

            <View style={styles.dialReadout}>
              <Text style={styles.dialReadoutLabel}>CENTS</Text>
              <Text
                style={[
                  styles.dialReadoutValue,
                  { color: theme.colors.secondary },
                  insufficientSignal && styles.dialReadoutMuted,
                ]}
              >
                {insufficientSignal ? EMPTY_READING : formatCents(cents)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function formatCents(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}`;
}

/** Split `E2`, `Bb3`, `F#4` into letter part and octave digits. */
function splitNoteName(fullName: string): { noteLetters: string; noteOctave: string } {
  const match = /^(.+?)(\d+)$/.exec(fullName.trim());
  if (!match) {
    return { noteLetters: fullName, noteOctave: '' };
  }
  return { noteLetters: match[1], noteOctave: match[2] };
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

/** Wedge along the tick arc for the in-tune cents range (center angle = 0 = vertical). */
function inTuneZonePath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  halfAngleDeg: number,
) {
  const a = -halfAngleDeg;
  const b = halfAngleDeg;
  const il = polarToCartesian(cx, cy, rInner, a);
  const ol = polarToCartesian(cx, cy, rOuter, a);
  const or = polarToCartesian(cx, cy, rOuter, b);
  const ir = polarToCartesian(cx, cy, rInner, b);
  return `M ${il.x} ${il.y} L ${ol.x} ${ol.y} A ${rOuter} ${rOuter} 0 0 1 ${or.x} ${or.y} L ${ir.x} ${ir.y} A ${rInner} ${rInner} 0 0 0 ${il.x} ${il.y} Z`;
}

function radialSegment(cx: number, cy: number, r0: number, r1: number, angleDeg: number) {
  const inner = polarToCartesian(cx, cy, r0, angleDeg);
  const outer = polarToCartesian(cx, cy, r1, angleDeg);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

const styles = StyleSheet.create({
  dialCard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 0,
  },
  dialFrame: {
    width: 340,
    height: 340,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    backgroundColor: alpha(theme.colors.surfaceContainer, 0.12),
  },
  dialFrameBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: alpha(theme.colors.outlineVariant, 0.08),
  },
  dialFrameInnerBorder: {
    position: 'absolute',
    inset: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: alpha(theme.colors.outlineVariant, 0.05),
  },
  dialSvg: {
    position: 'absolute',
  },
  dialTopLabel: {
    position: 'absolute',
    top: 18,
    fontFamily: theme.fonts.label,
    fontSize: 9,
    letterSpacing: 2.6,
    color: alpha(theme.colors.primary, 0.45),
  },
  dialSideLabelLeft: {
    position: 'absolute',
    left: 0,
    top: '47%',
    fontFamily: theme.fonts.label,
    fontSize: 9,
    color: alpha(theme.colors.onSurfaceVariant, 0.42),
    transform: [{ rotate: '-90deg' }],
  },
  dialSideLabelRight: {
    position: 'absolute',
    right: 0,
    top: '47%',
    fontFamily: theme.fonts.label,
    fontSize: 9,
    color: alpha(theme.colors.onSurfaceVariant, 0.42),
    transform: [{ rotate: '90deg' }],
  },
  dialNeedle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 6,
    height: 120,
    marginLeft: -3,
    marginTop: -100,
    borderRadius: 999,
    transformOrigin: '50% 100%',
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  dialNeedleMuted: {
    backgroundColor: alpha(theme.colors.outlineVariant, 0.45),
    shadowOpacity: 0,
  },
  dialNeedleOffTarget: {
    backgroundColor: alpha(theme.colors.primary, 0.38),
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
  dialCenter: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  dialNoteRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  dialNote: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 94,
    lineHeight: 100,
    color: theme.colors.primary,
    textShadowColor: alpha(theme.colors.primary, 0.55),
    textShadowRadius: 32,
  },
  dialNoteMuted: {
    fontSize: 72,
    lineHeight: 78,
    color: alpha(theme.colors.onSurfaceVariant, 0.35),
    textShadowRadius: 0,
    textShadowColor: 'transparent',
  },
  dialNoteOffTarget: {
    color: alpha(theme.colors.primary, 0.4),
    textShadowColor: alpha(theme.colors.primary, 0.22),
    textShadowRadius: 18,
  },
  dialNoteOctave: {
    marginLeft: 4,
    fontFamily: theme.fonts.displayStrong,
    fontSize: 24,
    lineHeight: 28,
    color: theme.colors.primary,
    textShadowColor: alpha(theme.colors.primary, 0.55),
    textShadowRadius: 8,
  },
  dialNoteOctaveOffTarget: {
    color: alpha(theme.colors.primary, 0.4),
    textShadowColor: alpha(theme.colors.primary, 0.22),
    textShadowRadius: 6,
  },
  dialReadoutRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  dialReadout: {
    alignItems: 'center',
    gap: 1,
  },
  dialReadoutLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 8,
    letterSpacing: 1.2,
    color: alpha(theme.colors.onSurfaceVariant, 0.5),
  },
  dialFreqValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  dialReadoutValue: {
    fontFamily: theme.fonts.display,
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  dialReadoutMuted: {
    color: alpha(theme.colors.onSurfaceVariant, 0.4),
  },
  dialReadoutUnit: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: alpha(theme.colors.onSurfaceVariant, 0.6),
  },
  dialDivider: {
    alignSelf: 'center',
    width: 1,
    height: 28,
    backgroundColor: alpha(theme.colors.outlineVariant, 0.18),
  },
});
