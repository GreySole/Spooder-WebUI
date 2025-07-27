import React, { useEffect } from 'react';
import { Footer } from '../app/Footer';
import { Box, Button, useTheme, Stack, useToast } from '@greysole/spooder-component-library';
import ThemeColor from './configTab/themeColor/ThemeColor';
import useThemeApi from '../../app/hooks/useThemeApi';
import EditCustomSpooder from './configTab/customSpooderInput/EditCustomSpooder';
import { set } from 'react-hook-form';
import { faArrowRotateLeft, faSave } from '@fortawesome/free-solid-svg-icons';

export default function ThemeTab() {
  const {
    themeVariables,
    customSpooder,
    setCustomSpooder,
    setThemeHue,
    setThemeSaturation,
    setThemeMode,
    setThemeMonospacedFont,
    setThemeFontWeight,
    setThemeLetterSpacing,
  } = useTheme();
  const { getSaveTheme, getSaveCustomSpooder } = useThemeApi();
  const { saveTheme } = getSaveTheme();
  const { saveCustomSpooder } = getSaveCustomSpooder();
  const { showSuccess, showInfo } = useToast();

  const [themeBeforeEdit, setThemeBeforeEdit] = React.useState({
    ...themeVariables,
    customSpooder: customSpooder,
  });
  const [themeHasChanged, setThemeHasChanged] = React.useState(
    themeVariables.hue !== themeBeforeEdit.hue ||
      themeVariables.saturation !== themeBeforeEdit.saturation ||
      themeVariables.isDarkTheme !== themeBeforeEdit.isDarkTheme ||
      themeVariables.isMonospacedFont !== themeBeforeEdit.isMonospacedFont ||
      themeVariables.fontWeight !== themeBeforeEdit.fontWeight ||
      themeVariables.letterSpacing !== themeBeforeEdit.letterSpacing ||
      JSON.stringify(customSpooder) !== JSON.stringify(themeBeforeEdit.customSpooder),
  );

  useEffect(() => {
    setThemeHasChanged(
      themeVariables.hue !== themeBeforeEdit.hue ||
        themeVariables.saturation !== themeBeforeEdit.saturation ||
        themeVariables.isDarkTheme !== themeBeforeEdit.isDarkTheme ||
        themeVariables.isMonospacedFont !== themeBeforeEdit.isMonospacedFont ||
        themeVariables.fontWeight !== themeBeforeEdit.fontWeight ||
        themeVariables.letterSpacing !== themeBeforeEdit.letterSpacing ||
        JSON.stringify(customSpooder) !== JSON.stringify(themeBeforeEdit.customSpooder),
    );
  }, [
    themeVariables.hue,
    themeVariables.saturation,
    themeVariables.isDarkTheme,
    themeVariables.isMonospacedFont,
    themeVariables.fontWeight,
    themeVariables.letterSpacing,
    customSpooder,
  ]);

  useEffect(() => {
    setThemeBeforeEdit({ ...themeVariables, customSpooder: customSpooder });
    setThemeHasChanged(
      themeVariables.hue !== themeBeforeEdit.hue ||
        themeVariables.saturation !== themeBeforeEdit.saturation ||
        themeVariables.isDarkTheme !== themeBeforeEdit.isDarkTheme ||
        themeVariables.isMonospacedFont !== themeBeforeEdit.isMonospacedFont ||
        themeVariables.fontWeight !== themeBeforeEdit.fontWeight ||
        themeVariables.letterSpacing !== themeBeforeEdit.letterSpacing ||
        JSON.stringify(customSpooder) !== JSON.stringify(themeBeforeEdit.customSpooder),
    );
  }, []);

  const handleSaveTheme = () => {
    saveTheme(
      themeVariables.hue,
      themeVariables.saturation,
      themeVariables.isDarkTheme,
      themeVariables.isMonospacedFont,
      themeVariables.fontWeight,
      themeVariables.letterSpacing,
    );
    saveCustomSpooder(customSpooder);
    showSuccess(`Theme and Custom Spooder settings saved!`);
    setThemeBeforeEdit({ ...themeVariables, customSpooder: customSpooder });
  };

  const revertThemeChanges = () => {
    // iterate through themeVariables and reset to initial values

    setThemeHue(themeBeforeEdit.hue);
    setThemeSaturation(themeBeforeEdit.saturation);
    setThemeMode(themeBeforeEdit.isDarkTheme);
    setThemeMonospacedFont(themeBeforeEdit.isMonospacedFont);
    setThemeFontWeight(themeBeforeEdit.fontWeight);
    setThemeLetterSpacing(themeBeforeEdit.letterSpacing);
    setCustomSpooder(themeBeforeEdit.customSpooder);

    setThemeHasChanged(false);

    showInfo(`Theme changes reverted to saved state.`);
  };

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <Stack spacing='xlarge' width='100%'>
        <ThemeColor />
        <EditCustomSpooder />
      </Stack>
      <Footer showFooter>
        <Box width='100%' justifyContent='flex-end' padding='medium' spacing='medium'>
          {themeHasChanged && (
            <Button icon={faArrowRotateLeft} label='Revert' onClick={revertThemeChanges} />
          )}
          <Button
            label='Save'
            className='save-button'
            icon={faSave}
            tooltipText='Save your theme and custom spooder settings'
            onClick={handleSaveTheme}
          />
        </Box>
      </Footer>
    </Box>
  );
}
