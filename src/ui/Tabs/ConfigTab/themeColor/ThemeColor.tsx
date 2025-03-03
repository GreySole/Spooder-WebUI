import React from 'react';
import { Box, Stack, Slider, BoolSwitch, useTheme } from '@greysole/spooder-component-library';

export default function ThemeColor() {
  const { themeColors, themeVariables, setThemeHue, setThemeMode, setThemeSaturation } = useTheme();
  return (
    <Box width='100%' padding='medium'>
      <Stack width='50%' spacing='large'>
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
  );
}
