import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { setCache } from "./slices/cache";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const CACHE_KEYS = {
  PLAYBACK: "playback",
  RECORDING: "recording",
  BROADCASTER: "broadcaster",
  STREAMING_START_TIME: "streaming_start_time",
};

const useCache = (key: string) => {
  const dispatch = useAppDispatch();
  const cache = useAppSelector((state) => state.cache.data);

  const setCacheWrapper = (value: any) =>
    dispatch(
      setCache({
        ...cache,
        [key]: value,
      })
    );
  const clearCache = () => {
    const newCache = { ...cache };
    delete newCache[key];
    dispatch(setCache(newCache));
  };
  return { cache: cache?.[key], setCache: setCacheWrapper, clearCache };
};

export default useCache;
