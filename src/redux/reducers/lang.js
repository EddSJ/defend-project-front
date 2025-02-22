import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: "en"
};

const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLang: (state, action) => {
      if (['en', 'es'].includes(action.payload)) {
        state.lang = action.payload;
      }
    },
  },
});

export const { setLang } = langSlice.actions;
export default langSlice.reducer;