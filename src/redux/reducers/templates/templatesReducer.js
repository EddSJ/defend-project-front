import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templates: [] 
};

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload; 
    },
  },
});

export const { setTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;