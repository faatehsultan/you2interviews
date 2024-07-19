import { configureStore } from "@reduxjs/toolkit";
import CacheReducer from "./slices/cache";

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
