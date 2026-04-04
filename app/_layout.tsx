import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { AppFrame } from '../src/components/AppFrame';
import { LoadingScreen } from '../src/components/LoadingScreen';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { SongLibraryProvider, useSongLibraryContext } from '../src/providers/SongLibraryProvider';
import { theme } from '../src/theme';

function WebViewportLock() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-cuerdario-web-shell', 'true');
    style.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
        background: ${theme.colors.surface};
      }

      body {
        position: fixed;
        inset: 0;
      }

      #root {
        width: 100%;
        height: 100%;
        background: ${theme.colors.surface};
      }

      @media (hover: none) and (pointer: coarse) {
        input,
        textarea,
        select {
          font-size: 16px !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  return null;
}

function RootNavigator() {
  const fontsLoaded = useAppFonts();
  const { isReady } = useSongLibraryContext();

  if (!fontsLoaded || !isReady) {
    return (
      <AppFrame>
        <LoadingScreen />
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.surface,
          },
        }}
      />
    </AppFrame>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <WebViewportLock />
      <SongLibraryProvider>
        <RootNavigator />
      </SongLibraryProvider>
    </SafeAreaProvider>
  );
}
