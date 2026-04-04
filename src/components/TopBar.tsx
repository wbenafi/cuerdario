import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '../icons';
import { theme } from '../theme';

const headerWave = require('../../assets/header-wave.png');

export function TopBar({
  onTrailingPress,
  trailingIcon = 'search',
}: {
  onTrailingPress?: () => void;
  trailingIcon?: 'search';
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarBrand}>
        <View style={styles.brandMarkContainer}>
          <Image source={headerWave} style={styles.brandMark} resizeMode="contain" />
        </View>
        <Text style={styles.brandWordmark}>Cuerdario</Text>
      </View>

      <Pressable
        disabled={!onTrailingPress}
        onPress={onTrailingPress}
        style={[styles.topBarButton, !onTrailingPress && styles.topBarButtonDisabled]}
      >
        <Icon color={theme.colors.primary} name={trailingIcon} size={15} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 64,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  topBarButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkContainer: {
    width: 56,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMark: {
    width: '100%',
    height: '100%',
  },
  topBarButtonDisabled: {
    opacity: 0.55,
  },
  brandWordmark: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 18,
    fontStyle: 'italic',
    color: theme.colors.primary,
  },
});
