import React from 'react';
import { Footer } from '../app/Footer';
import { Box, ResetButton, SaveButton } from '@greysole/spooder-component-library';
import EditCustomSpooder from './ConfigTab/customSpooderInput/EditCustomSpooder';
import ThemeColor from './ConfigTab/themeColor/ThemeColor';

export default function ThemeTab() {
  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <ThemeColor />
      <EditCustomSpooder />
      <Footer showFooter={true}>
        <ResetButton />
        <SaveButton saveFunction={() => {}} />
      </Footer>
    </Box>
  );
}
