import React from 'react';
import {
  Box,
  Stack,
  Columns,
  Slider,
  BoolSwitch,
  useTheme,
  TextInput,
  NumberInput,
  TypeFace,
  hslToHex,
} from '@spooder/webui-component-library';

export default function ThemeColor() {
  const { themeColors, themeVariables, setThemeHue, setThemeMode, setThemeSaturation } = useTheme();

  const parseHueInput = (value: string) => {
    let parsedValue = parseFloat(value);
    parsedValue < 0 && (parsedValue = 0);
    parsedValue > 360 && (parsedValue = 360);
    return isNaN(parsedValue) ? 0 : parsedValue / 360;
  };
  const parseSaturationInput = (value: string) => {
    let parsedValue = parseFloat(value.slice(0, -1));
    parsedValue < 0 && (parsedValue = 0);
    parsedValue > 100 && (parsedValue = 100);
    return isNaN(parsedValue) ? 0 : parsedValue / 100;
  };

  const parseHueSliderColors = (hue: number) => {
    const gradientColors = [
      themeVariables.isDarkTheme ? '#222222' : '#AAAAAA',
      hslToHex(Math.round(hue * 360), 100, 50),
    ];

    return gradientColors.join(', ');
  };
  return (
    <Stack spacing='medium' width='100%'>
      <TypeFace fontSize='large' fontWeight='bold'>
        Theme Color
      </TypeFace>
      <Columns spacing='xlarge' width='100%'>
        <Box width='50%' padding='xsmall'>
          <Slider
            orientation={'horizontal'}
            gradient={'#FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000'}
            value={themeVariables.hue}
            step={1 / 360}
            onChange={(value: number) => {
              setThemeHue(value);
            }}
          />
        </Box>
        <Box width='50%'>
          <TextInput
            label='Hue'
            value={`${Math.round(themeVariables.hue * 360)}`}
            onInput={(value) => setThemeHue(parseHueInput(value))}
            selectOnFocus={true}
            unit='°'
          />
        </Box>
      </Columns>
      <Columns spacing='xlarge' width='100%'>
        <Box width='50%' padding='xsmall'>
          <Slider
            orientation={'horizontal'}
            gradient={parseHueSliderColors(themeVariables.hue)}
            value={themeVariables.saturation}
            step={1 / 100}
            onChange={(value: number) => {
              setThemeSaturation(value);
            }}
          />
        </Box>
        <Box width='50%'>
          <TextInput
            label='Saturation'
            value={`${Math.round(themeVariables.saturation * 100)}`}
            onInput={(value) => setThemeSaturation(parseSaturationInput(value))}
            selectOnFocus={true}
            unit='%'
          />
        </Box>
      </Columns>
      <BoolSwitch
        label='Use Dark Theme'
        value={themeVariables.isDarkTheme}
        onChange={() => {
          setThemeMode(!themeVariables.isDarkTheme);
        }}
      />
    </Stack>
  );
}
