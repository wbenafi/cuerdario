import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

export function FilterChip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipLabel, active && styles.filterChipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceHigh,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 10,
    color: theme.colors.onSurface,
  },
  filterChipLabelActive: {
    color: theme.colors.onPrimary,
  },
});
