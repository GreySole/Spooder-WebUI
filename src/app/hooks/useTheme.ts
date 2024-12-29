import { Tuple } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import {
  _setCustomSpooder,
  _setThemeColors,
  _setHue,
  _setSaturation,
  _setMode,
  _setIsMobileDevice,
} from '../slice/themeSlice';
import { KeyedObject, ThemeColors, ThemeVariables } from '../../ui/Types';
import {
  hexToRGBArray,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  fullLuminance,
  setLuminance,
  contrastingColor,
} from '../../ui/util/ColorUtil';
import { useCallback, useEffect } from 'react';

const applyThemeColors = (colors: ThemeColors) => {
  const {
    baseColor,
    backgroundColorFar,
    backgroundColorNear,
    buttonBackgroundColor,
    buttonBorderColor,
    buttonFontColor,
    colorAnalogousCW,
    colorAnalogousCCW,
    darkColorAnalogousCCW,
    darkColorAnalogousCW,
    buttonFontColorAnalogousCW,
    buttonFontColorAnalogousCCW,
    inputTextColor,
    inputBackgroundColor,
  } = colors;

  document.documentElement.style.setProperty('--color-primary', baseColor);
  document.documentElement.style.setProperty('--color-background-far', backgroundColorFar);
  document.documentElement.style.setProperty('--color-background-near', backgroundColorNear);
  document.documentElement.style.setProperty('--button-background-color', buttonBackgroundColor);
  document.documentElement.style.setProperty('--button-border-color', buttonBorderColor);
  document.documentElement.style.setProperty('--button-font-color', buttonFontColor);
  document.documentElement.style.setProperty('--button-font-color', buttonFontColor);

  document.documentElement.style.setProperty('--color-dark-analogous-cw', darkColorAnalogousCW);
  document.documentElement.style.setProperty('--color-dark-analogous-ccw', darkColorAnalogousCCW);
  document.documentElement.style.setProperty('--color-analogous-cw', colorAnalogousCW);
  document.documentElement.style.setProperty('--color-analogous-ccw', colorAnalogousCCW);
  document.documentElement.style.setProperty(
    '--button-font-color-analogous-cw',
    buttonFontColorAnalogousCW,
  );
  document.documentElement.style.setProperty(
    '--button-font-color-analogous-ccw',
    buttonFontColorAnalogousCCW,
  );

  document.documentElement.style.setProperty('--input-text-color', inputTextColor);
  document.documentElement.style.setProperty('--input-background-color', inputBackgroundColor);
};

/*const calculateThemeColors = (color: string) => {
  const rgbArray = hexToRGBArray(color);
  // Convert the color to HSL array
  const hslColor = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2]);

  // Calculate the clockwise analogous color
  const cwHslColor = hslColor.map((v, i) => (i === 0 ? (v + 30) % 360 : v));
  const cwRgbColor = hslToRgb(cwHslColor[0], cwHslColor[1], cwHslColor[2]);
  const cwAnalogousColor = rgbToHex(cwRgbColor[0], cwRgbColor[1], cwRgbColor[2]);

  // Calculate the counterclockwise analogous color
  const ccwHslColor = hslColor.map((v, i) => (i === 0 ? (v - 30) % 360 : v));
  const ccwRgbColor = hslToRgb(ccwHslColor[0], ccwHslColor[1], ccwHslColor[2]);
  const ccwAnalogousColor = rgbToHex(ccwRgbColor[0], ccwRgbColor[1], ccwRgbColor[2]);

  return {
    baseColor: color,
    buttonFontColor: contrastingColor(color),
    colorAnalogousCW: cwAnalogousColor,
    colorAnalogousCCW: ccwAnalogousColor,
    buttonFontColorAnalogousCW: contrastingColor(cwAnalogousColor),
    buttonFontColorAnalogousCCW: contrastingColor(ccwAnalogousColor),
  } as ThemeColors;
};*/

const calculateThemeColors = (color: string, isDarkTheme: boolean) => {
  const rgbArray = hexToRGBArray(color);
  // Convert the color to HSL array
  const hslColor = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2]);

  // Calculate the clockwise analogous color
  const cwHslColor = hslColor.map((v, i) => (i === 0 ? (v + 30) % 360 : v));
  const cwRgbColor = hslToRgb(cwHslColor[0], cwHslColor[1], cwHslColor[2]);
  const cwAnalogousColor = rgbToHex(cwRgbColor[0], cwRgbColor[1], cwRgbColor[2]);

  // Calculate the counterclockwise analogous color
  const ccwHslColor = hslColor.map((v, i) => (i === 0 ? (v - 30) % 360 : v));
  const ccwRgbColor = hslToRgb(ccwHslColor[0], ccwHslColor[1], ccwHslColor[2]);
  const ccwAnalogousColor = rgbToHex(ccwRgbColor[0], ccwRgbColor[1], ccwRgbColor[2]);

  const baseColor = fullLuminance(color);
  const backgroundColorFar = setLuminance(baseColor, 0.05);
  const backgroundColorNear = setLuminance(baseColor, 0.1);
  const buttonBackgroundColor = setLuminance(baseColor, 0.2);
  const buttonBorderColor = baseColor;

  //console.log('DARK THEME', isDarkTheme, isDarkTheme ? '#fff' : '#000');

  return {
    baseColor: baseColor,
    backgroundColorFar,
    backgroundColorNear,
    buttonBackgroundColor,
    buttonBorderColor,
    buttonFontColor: isDarkTheme ? '#fff' : '#000',
    darkColorAnalogousCW: setLuminance(cwAnalogousColor, 0.2),
    darkColorAnalogousCCW: setLuminance(ccwAnalogousColor, 0.2),
    colorAnalogousCW: cwAnalogousColor,
    colorAnalogousCCW: ccwAnalogousColor,
    buttonFontColorAnalogousCW: isDarkTheme ? '#fff' : '#000',
    buttonFontColorAnalogousCCW: isDarkTheme ? '#fff' : '#000',
    inputTextColor: isDarkTheme ? '#fff' : '#000',
    inputBackgroundColor: isDarkTheme ? '#000' : '#fff',
  } as ThemeColors;
};

export default function useTheme() {
  const dispatch = useDispatch();
  const themeColors = useSelector(
    (state: IRootState) => state.themeSlice.themeColors as ThemeColors,
  );
  const isMobileDevice = useSelector((state: IRootState) => state.themeSlice.isMobileDevice);

  const themeConstants = {
    settings: '#090',
    assets: '#008080',
    delete: '#8f2525',
  };

  const themeVariables = useSelector(
    (state: IRootState) => state.themeSlice.themeVariables as ThemeVariables,
  );
  const customSpooder = useSelector((state: IRootState) => state.themeSlice.customSpooder);

  const handleResize = useCallback(() => {
    dispatch(_setIsMobileDevice());
  }, []);

  useEffect(() => {
    setThemeHue(themeVariables.hue);
    setThemeSaturation(themeVariables.saturation);
    setThemeMode(themeVariables.isDarkTheme);

    window.addEventListener('resize', handleResize);
  }, [handleResize]);

  function setThemeHue(hue: number) {
    const newRgb = hslToRgb(hue * 360, themeVariables.saturation * 100, 50);
    const newColors = calculateThemeColors(
      rgbToHex(newRgb[0], newRgb[1], newRgb[2]),
      themeVariables.isDarkTheme,
    );
    dispatch(_setHue(hue));
    dispatch(_setThemeColors(newColors));
    applyThemeColors(newColors);
  }

  function setThemeSaturation(saturation: number) {
    const newRgb = hslToRgb(themeVariables.hue * 360, saturation * 100, 50);
    const newColors = calculateThemeColors(
      rgbToHex(newRgb[0], newRgb[1], newRgb[2]),
      themeVariables.isDarkTheme,
    );
    dispatch(_setSaturation(saturation));
    dispatch(_setThemeColors(newColors));
    applyThemeColors(newColors);
  }

  function setThemeMode(isDarkTheme: boolean) {
    dispatch(_setMode(isDarkTheme));
    const newColors = calculateThemeColors(themeColors.baseColor, isDarkTheme);
    dispatch(_setThemeColors(newColors));
    applyThemeColors(newColors);
  }

  function setThemeColor(color: string) {
    console.log(color, calculateThemeColors(color, true));
    dispatch(_setThemeColors(calculateThemeColors(color, true)));
    applyThemeColors(themeColors);
  }

  function refreshThemeColors() {
    applyThemeColors(themeColors);
  }

  function setCustomSpooder(parts: any, colors: any) {
    dispatch(_setCustomSpooder({ parts: parts, colors: colors }));
  }

  return {
    themeColors,
    themeConstants,
    themeVariables,
    customSpooder,
    isMobileDevice,
    setThemeColor,
    setThemeHue,
    setThemeMode,
    setThemeSaturation,
    refreshThemeColors,
    setCustomSpooder,
  };
}
