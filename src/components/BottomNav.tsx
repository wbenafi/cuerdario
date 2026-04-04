import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '../icons';
import { appRoutes } from '../navigation/routes';
import { alpha, theme } from '../theme';

type RootTab = 'tuner' | 'library';

export function BottomNav({ currentTab }: { currentTab: RootTab }) {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <NavItem
        active={currentTab === 'tuner'}
        icon="tuner"
        label="Tuner"
        onPress={() => router.replace(appRoutes.tuner)}
      />
      <NavItem
        active={currentTab === 'library'}
        icon="library"
        label="Songs"
        onPress={() => router.replace(appRoutes.library)}
      />
    </View>
  );
}

function NavItem({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: 'library' | 'tuner';
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}>
      <Icon
        color={active ? theme.colors.primary : alpha(theme.colors.onSurfaceVariant, 0.7)}
        name={icon}
        size={20}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 80,
    paddingHorizontal: 56,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: alpha(theme.colors.surfaceHighest, 0.3),
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: alpha(theme.colors.surfaceLow, 0.92),
    shadowColor: '#000000',
    shadowOpacity: 0.34,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -6 },
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navItemActive: {
    transform: [{ translateY: -2 }],
  },
  navLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: alpha(theme.colors.onSurfaceVariant, 0.72),
  },
  navLabelActive: {
    color: theme.colors.primary,
  },
});
