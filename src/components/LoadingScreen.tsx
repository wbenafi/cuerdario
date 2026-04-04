import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

export function LoadingScreen() {
  return (
    <View style={styles.loadingScreen}>
      <Text style={styles.loadingEyebrow}>Cuerdario</Text>
      <Text style={styles.loadingTitle}>Warming the studio...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingEyebrow: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: theme.colors.secondary,
  },
  loadingTitle: {
    fontFamily: theme.fonts.displayStrong,
    fontSize: 28,
    color: theme.colors.onSurface,
  },
});
