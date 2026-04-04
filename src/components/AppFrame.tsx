import { StatusBar, StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { alpha, theme } from '../theme';

export function AppFrame({ children, style }: ViewProps) {
  const { width } = useWindowDimensions();
  const useDesktopFrame = width >= 480;
  const isWeb = typeof document !== 'undefined';

  return (
    <SafeAreaView style={[styles.safeArea, isWeb ? styles.safeAreaWeb : null]}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />

      <View style={[styles.root, isWeb ? styles.rootWeb : null]}>
        <View style={[styles.rootGlow, styles.rootGlowTop]} />
        <View style={[styles.rootGlow, styles.rootGlowBottom]} />

        <View
          style={[
            styles.stage,
            useDesktopFrame ? styles.stageDesktop : styles.stageMobile,
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  safeAreaWeb: {
    width: '100%',
    height: '100%',
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  rootWeb: {
    width: '100%',
    minHeight: '100%',
  },
  rootGlow: {
    position: 'absolute',
    borderRadius: 999,
  },
  rootGlowTop: {
    top: -80,
    right: -30,
    width: 240,
    height: 240,
    backgroundColor: alpha(theme.colors.primary, 0.08),
  },
  rootGlowBottom: {
    bottom: -60,
    left: -50,
    width: 260,
    height: 260,
    backgroundColor: alpha(theme.colors.secondary, 0.08),
  },
  stage: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  stageMobile: {
    width: '100%',
  },
  stageDesktop: {
    width: '100%',
    maxWidth: 390,
    marginVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: alpha(theme.colors.outlineVariant, 0.22),
    shadowColor: '#000000',
    shadowOpacity: 0.32,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
  },
});
