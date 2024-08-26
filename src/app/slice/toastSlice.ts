import { createSlice } from '@reduxjs/toolkit';

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    text: '',
    type: '',
    toastOpen: false,
  },
  reducers: {
    _showToast: (state, action) => {
      state.text = action.payload.text;
      state.type = action.payload.type;
      const duration = action.payload.duration;
      state.toastOpen = true;
      setTimeout(() => {
        state.toastOpen = false;
      }, duration);
    },
  },
});

export const { _showToast } = toastSlice.actions;

export default toastSlice.reducer;
