import { configureStore } from "@reduxjs/toolkit";
import CacheReducer from "./cache";

export const store = configureStore({
  reducer: {
    cache: CacheReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
