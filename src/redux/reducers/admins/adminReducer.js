import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admmin: {}
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admmin = action.payload; 
    },
  },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;