import { Tuple } from '@reduxjs/toolkit';

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

export function luminance(r: number, g: number, b: number) {
  let a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

export function luma(color: string | []) {
  // color can be a hx string or an array of RGB values 0-255
  let rgb = typeof color === 'string' ? hexToRGBArray(color) : color;
  return luminance(rgb[0], rgb[1], rgb[2]);
}

export function fullLuminance(color: string): string {
  const rgb = typeof color === 'string' ? hexToRGBArray(color) : color;
  const [r, g, b] = rgb;
  const [h, s] = rgbToHsl(r, g, b);
  const fullLuminanceRgb = hslToRgb(h, s, 50);
  return rgbToHex(fullLuminanceRgb[0], fullLuminanceRgb[1], fullLuminanceRgb[2]);
}

export function setLuminance(color: string, luminance: number): string {
  if (luminance < 0 || luminance > 1) {
    throw new Error('Luminance must be between 0.0 and 1.0');
  }

  const rgb = typeof color === 'string' ? hexToRGBArray(color) : color;
  const [r, g, b] = rgb;
  const [h, s] = rgbToHsl(r, g, b);
  const newLuminanceRgb = hslToRgb(h, s, luminance * 100);
  return rgbToHex(newLuminanceRgb[0], newLuminanceRgb[1], newLuminanceRgb[2]);
}

export function contrastingColor(color: string) {
  let lum1 = luma('#fff');
  let lum2 = luma(color);
  let brightest = Math.max(lum1, lum2);
  let darkest = Math.min(lum1, lum2);

  let contrastRatio = (brightest + 0.05) / (darkest + 0.05);

  return `#${contrastRatio <= 4.5 ? '000' : 'fff'}`;
}

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;

export function hexToRGBArray(color: string) {
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

export const rgbToHsl = (r: number, g: number, b: number) => {
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

export const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const rgb = [f(0), f(8), f(4)].map((v) => Math.round(v * 255));

  return rgb as Tuple;
};
