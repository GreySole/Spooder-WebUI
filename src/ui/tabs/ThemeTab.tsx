import React from 'react';
import EditCustomSpooder from './configTab/customSpooderInput/EditCustomSpooder';
import ThemeColor from './configTab/themeColor/ThemeColor';
import { Footer } from '../app/Footer';
import Box from '../common/layout/Box';
import SaveButton from '../common/input/form/SaveButton';
import ResetButton from '../common/input/form/ResetButton';

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
