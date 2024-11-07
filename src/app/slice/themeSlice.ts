import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    themeColors:
      localStorage.getItem('themeColors') != null
        ? JSON.parse(localStorage.getItem('themeColors')!)
        : {
            baseColor: '#525252',
            buttonFontColor: '#fff',
            colorAnalogousCW: '#525252',
            colorAnalogousCCW: '#525252',
            buttonFontColorAnalogousCW: '#fff',
            buttonFontColorAnalogousCCW: '#fff',
          },
    customSpooder: {
      parts: {
        bigeyeleft: '',
        bigeyeright: '',
        littleeyeleft: '',
        littleeyeright: '',
        fangleft: '',
        fangright: '',
        mouth: '',
        bodyleft: '',
        bodyright: '',
        shortlegleft: '',
        longlegleft: '',
        shortlegright: '',
        longlegright: '',
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
      /*parts: {
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
      },*/
    },
  },
  reducers: {
    _setThemeColors: (state, action) => {
      console.log('SET THEME COLORS', action);
      state.themeColors = action.payload;
      localStorage.setItem('themeColors', JSON.stringify(action.payload));
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

export const { _setThemeColors, _setCustomSpooder } = themeSlice.actions;

export default themeSlice.reducer;
