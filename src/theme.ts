export const theme = {
  colors: {
    surface: '#131313',
    surfaceContainer: '#201f1f',
    surfaceHigh: '#2a2a2a',
    surfaceLow: '#1c1b1b',
    surfaceLowest: '#0e0e0e',
    surfaceHighest: '#353534',
    primary: '#ffb95f',
    primaryContainer: '#ca8100',
    secondary: '#ffb693',
    onPrimary: '#472a00',
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#dbc2b0',
    outline: '#a38c7c',
    outlineVariant: '#554336',
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  spacing: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
  },
  fonts: {
    display: 'Manrope_700Bold',
    displayStrong: 'Manrope_800ExtraBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    label: 'Inter_600SemiBold',
  },
} as const;

export function alpha(hex: string, opacity: number) {
  const sanitized = hex.replace('#', '');
  const full = sanitized.length === 3
    ? sanitized
        .split('')
        .map((value) => value + value)
        .join('')
    : sanitized;
  const red = Number.parseInt(full.slice(0, 2), 16);
  const green = Number.parseInt(full.slice(2, 4), 16);
  const blue = Number.parseInt(full.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
