import React from 'react';
import { Footer } from '../app/Footer';
import { Box, ResetButton, SaveButton } from '@greysole/spooder-component-library';
import EditCustomSpooder from './configTab/customSpooderInput/EditCustomSpooder';
import ThemeColor from './configTab/themeColor/ThemeColor';

export default function ThemeTab() {
  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <ThemeColor />
      <EditCustomSpooder />
      <Footer showFooter={true}>Test</Footer>
    </Box>
  );
}
