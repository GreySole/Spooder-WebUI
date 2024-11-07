import { Tuple } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { _setCustomSpooder, _setThemeColors } from '../slice/themeSlice';
import { KeyedObject, ThemeColors } from '../../ui/Types';

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r: number, g: number, b: number) {
  let a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function luma(color: string | []) {
  // color can be a hx string or an array of RGB values 0-255
  let rgb = typeof color === 'string' ? hexToRGBArray(color) : color;
  return luminance(rgb[0], rgb[1], rgb[2]);
}

function contrastingColor(color: string) {
  let lum1 = luma('#fff');
  let lum2 = luma(color);
  let brightest = Math.max(lum1, lum2);
  let darkest = Math.min(lum1, lum2);

  let contrastRatio = (brightest + 0.05) / (darkest + 0.05);

  return `#${contrastRatio <= 4.5 ? '000' : 'fff'}`;
}

const rgbToHex = (r: number, g: number, b: number) =>
  `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;

function hexToRGBArray(color: string) {
  color = color.replace('#', '');
  if (color.length === 3)
    color =
      color.charAt(0) +
      color.charAt(0) +
      color.charAt(1) +
      color.charAt(1) +
      color.charAt(2) +
      color.charAt(2);
  else if (color.length !== 6) throw 'Invalid hex color: ' + color;
  let rgb = [] as Number[];
  for (let i = 0; i <= 2; i++) rgb[i] = parseInt(color.substr(i * 2, 2), 16);

  return rgb as Tuple;
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
  const hsl = [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];

  return hsl as Tuple;
};

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const rgb = [f(0), f(8), f(4)].map((v) => Math.round(v * 255));

  return rgb as Tuple;
};

const applyThemeColors = (colors: KeyedObject) => {
  const {
    baseColor,
    buttonFontColor,
    colorAnalogousCW,
    colorAnalogousCCW,
    buttonFontColorAnalogousCW,
    buttonFontColorAnalogousCCW,
  } = colors;

  document.documentElement.style.setProperty('--color-primary', baseColor);
  document.documentElement.style.setProperty('--button-font-color', buttonFontColor);

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
};

const calculateThemeColors = (color: string) => {
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
};

export default function useTheme() {
  const dispatch = useDispatch();
  const themeColors = useSelector(
    (state: IRootState) => state.themeSlice.themeColors as ThemeColors,
  );
  const customSpooder = useSelector((state: IRootState) => state.themeSlice.customSpooder);

  function setThemeColor(color: string) {
    console.log(color, calculateThemeColors(color));
    dispatch(_setThemeColors(calculateThemeColors(color)));
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
    customSpooder,
    setThemeColor,
    refreshThemeColors,
    setCustomSpooder,
  };
}
