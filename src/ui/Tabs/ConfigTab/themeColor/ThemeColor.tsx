import React from 'react';
import Expandable from '../../../common/layout/Expandable';
import useTheme from '../../../../app/hooks/useTheme';
import Slider from '../../../common/input/general/Slider';
import Stack from '../../../common/layout/Stack';
import { hslToRgb, rgbToHex } from '../../../util/ColorUtil';
import BoolSwitch from '../../../common/input/controlled/BoolSwitch';
import Box from '../../../common/layout/Box';

export default function ThemeColor() {
  const { themeColors, themeVariables, setThemeHue, setThemeMode, setThemeSaturation } = useTheme();
  return (
    <Expandable label='Theme Color'>
      <Box width='100%' padding='medium'>
        <Stack spacing='large'>
          <Slider
            orientation={'horizontal'}
            gradient={'#FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000'}
            value={themeVariables.hue}
            onChange={(value) => {
              setThemeHue(value);
            }}
          />
          <Slider
            orientation={'horizontal'}
            gradient={`#FFFFFF, ${themeColors.baseColor}`}
            value={themeVariables.saturation}
            onChange={(value) => {
              setThemeSaturation(value);
            }}
          />
          <BoolSwitch
            label='Dark Theme'
            value={themeVariables.isDarkTheme}
            onChange={() => {
              setThemeMode(!themeVariables.isDarkTheme);
            }}
          />
        </Stack>
      </Box>
    </Expandable>
  );
}
