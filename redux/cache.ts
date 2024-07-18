import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    setCache: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setCache } = cacheSlice.actions;

export default cacheSlice.reducer;
