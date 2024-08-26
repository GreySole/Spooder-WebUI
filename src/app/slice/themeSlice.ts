import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    themeColor:
      localStorage.getItem('themeColor') !== undefined
        ? JSON.parse(localStorage.getItem('themeColor')!)
        : '#006e6e',
    customSpooder: {
      parts: {
        bigeyeleft: 'o',
        bigeyeright: 'o',
        littleeyeleft: '\u00ba',
        littleeyeright: '\u00ba',
        fangleft: ' ',
        fangright: ' ',
        mouth: '\u03c9',
        bodyleft: '(',
        bodyright: ')',
        shortlegleft: '/\\',
        longlegleft: '/╲',
        shortlegright: '/\\',
        longlegright: '╱\\',
      },
      colors: {
        bigeyeleft: '#FFFFFF',
        bigeyeright: '#FFFFFF',
        littleeyeleft: '#FFFFFF',
        littleeyeright: '#FFFFFF',
        fangleft: '#FFFFFF',
        fangright: '#FFFFFF',
        mouth: '#FFFFFF',
        bodyleft: '#FFFFFF',
        bodyright: '#FFFFFF',
        shortlegleft: '#FFFFFF',
        shortlegright: '#FFFFFF',
        longlegleft: '#FFFFFF',
        longlegright: '#FFFFFF',
      },
    },
  },
  reducers: {
    _setThemeColor: (state, action) => {
      state.themeColor = action.payload.themeColor;
    },
    _setCustomSpooder: (state, action) => {
      if (action.payload.colors) {
        Object.assign(state.customSpooder.colors, action.payload.colors);
      }
      if (action.payload.parts) {
        Object.assign(state.customSpooder.parts, action.payload.parts);
      }
    },
  },
});

export const { _setThemeColor, _setCustomSpooder } = themeSlice.actions;

export default themeSlice.reducer;
