import { useDispatch, useSelector } from "react-redux";
import { setCache } from "./cache";

export const CACHE_KEYS = {
  PLAYBACK: "playback",
  STREAMING_START_TIME: "streaming_start_time",
};

export default function useCache(key: string) {
  const dispatch = useDispatch();
  const cache = useSelector((state: any) => state.cache);

  const _get = () => {
    return cache[key];
  };
  const _set = (value: any) => {
    const newCache = cache;
    newCache[key] = value;

    dispatch(setCache(newCache));
  };
  const _clear = () => {
    const newCache = { ...cache };
    delete newCache[key];
    dispatch(setCache(newCache));
  };

  return {
    get: _get,
    set: _set,
    clear: _clear,
  };
}
