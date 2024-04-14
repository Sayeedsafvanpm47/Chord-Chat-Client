import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: "dark"
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      // Instead of modifying state directly, return a new state object
      return {
        ...state,
        mode: state.mode === 'light' ? 'dark' : 'light'
      };
    }
  }
});

export const { setMode } = globalSlice.actions;
export default globalSlice.reducer;
