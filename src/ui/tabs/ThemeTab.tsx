import React from 'react';
import { Footer } from '../app/Footer';
import {
  Box,
  Button,
  ResetButton,
  SaveButton,
  useTheme,
  Stack,
} from '@greysole/spooder-component-library';
import EditCustomSpooder from './configTab/customSpooderInput/EditCustomSpooder';
import ThemeColor from './configTab/themeColor/ThemeColor';
import useThemeApi from '../../app/hooks/useThemeApi';

export default function ThemeTab() {
  const { themeVariables, customSpooder } = useTheme();
  const { getSaveTheme, getSaveCustomSpooder } = useThemeApi();
  const { saveTheme } = getSaveTheme();
  const { saveCustomSpooder } = getSaveCustomSpooder();

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <Stack spacing='large' width='100%' padding='medium'>
        <ThemeColor />
        <EditCustomSpooder />
      </Stack>
      <Footer showFooter={true}>
        <Box width='100%' justifyContent='flex-end' padding='medium'>
          <Button
            label='Save'
            onClick={() => {
              saveTheme(themeVariables.hue, themeVariables.saturation, themeVariables.isDarkTheme);
              saveCustomSpooder(customSpooder.parts, customSpooder.colors);
            }}
          />
        </Box>
      </Footer>
    </Box>
  );
}
