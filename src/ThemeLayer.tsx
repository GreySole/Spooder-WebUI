import { ThemeProvider } from '@spooder/webui-component-library';
import React from 'react';
import useThemeApi from './app/hooks/useThemeApi';
import InitLayer from './InitLayer';

export default function ThemeLayer() {
  const { getMainTheme, getCustomSpooder } = useThemeApi();
  const { data, isLoading, error } = getMainTheme();
  const {
    data: customSpooder,
    isLoading: isLoadingCustomSpooder,
    error: errorCustomSpooder,
  } = getCustomSpooder();
  if (isLoading || isLoadingCustomSpooder) {
    return null;
  }

  let finalCustomSpooder = customSpooder;

  if (!Array.isArray(customSpooder)) {
    const defaultCustomSpooder = [
        { partString: '/╲', partColor: '#FFFFFF' },
        { partString: '/\\', partColor: '#FFFFFF' },
        { partString: '(', partColor: '#FFFFFF' },
        { partString: ' ', partColor: '#FFFFFF' },
        { partString: 'º', partColor: '#FFFFFF' },
        { partString: 'o', partColor: '#FFFFFF' },
        { partString: 'ω', partColor: '#FFFFFF' },
        { partString: 'o', partColor: '#FFFFFF' },
        { partString: 'º', partColor: '#FFFFFF' },
        { partString: ' ', partColor: '#FFFFFF' },
        { partString: ')', partColor: '#FFFFFF' },
        { partString: '/\\', partColor: '#FFFFFF' },
        { partString: '╱\\', partColor: '#FFFFFF' },
      ];
      finalCustomSpooder = defaultCustomSpooder;
  }

  return (
    <ThemeProvider theme={{ ...data }} spooder={[...finalCustomSpooder]}>
      <InitLayer />
    </ThemeProvider>
  );
}
