import { createSlice } from '@reduxjs/toolkit';

export const footerSlice = createSlice({
  name: 'footer',
  initialState: {
    save: undefined as Function | undefined,
    reset: undefined as Function | undefined,
    showFooter: true,
  },
  reducers: {
    _setSave: (state, action) => {
      state.save = action.payload.saveFunction;
    },
    _setReset: (state, action) => {
      state.reset = action.payload.resetFunction;
    },
    _unsetSave: (state) => {
      state.save = undefined;
    },
    _unsetReset: (state) => {
      state.reset = undefined;
    },
    _showFooter: (state, action) => {
      state.showFooter = action.payload.showFooter;
    },
  },
});

export const { _setSave, _setReset, _unsetSave, _unsetReset, _showFooter } = footerSlice.actions;

export default footerSlice.reducer;
