import { createSlice } from '@reduxjs/toolkit';

export const hotkeySlice = createSlice({
  name: 'hotkey',
  initialState: {
    save: () => {},
    enter: () => {},
  },
  reducers: {
    _setSave: (state, action) => {
      state.save = action.payload.saveFunction;
    },
    _setEnter: (state, action) => {
      state.enter = action.payload.enterFunction;
    },
    _unsetSave: (state) => {
      state.save = () => {};
    },
    _unsetEnter: (state) => {
      state.enter = () => {};
    },
  },
});

export const { _setSave, _setEnter, _unsetSave, _unsetEnter } = hotkeySlice.actions;

export default hotkeySlice.reducer;
