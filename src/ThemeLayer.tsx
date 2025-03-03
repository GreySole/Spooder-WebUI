import { ThemeProvider } from '@greysole/spooder-component-library';
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
  return (
    <ThemeProvider theme={{ ...data }} spooder={{ ...customSpooder }}>
      <InitLayer />
    </ThemeProvider>
  );
}
