import { createSlice } from "@reduxjs/toolkit";

export interface CacheState {
  data: object;
}

const initialState: CacheState = {
  data: {},
};

export const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    setCache: (state, action) => {
      state.data = {
        ...action.payload,
      };
    },
  },
});

export const { setCache } = cacheSlice.actions;
export default cacheSlice.reducer;
