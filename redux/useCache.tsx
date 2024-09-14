import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { setCache } from "./slices/cache";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const CACHE_KEYS = {
  ENV: "env", // specified for dynamic env vars only

  PLAYBACK: "playback",
  RECORDING: "recording",
  BROADCASTER: "broadcaster",
  STREAMING_START_TIME: "streaming_start_time",
  CLOUD_PLAY_FILE: "cloud_play_file",
};

export enum EnvVars {
  EXPO_PUBLIC_AGORA_APP_ID,
  EXPO_PUBLIC_BACKEND_URL,
  EXPO_PUBLIC_apiKey,
  EXPO_PUBLIC_authDomain,
  EXPO_PUBLIC_projectId,
  EXPO_PUBLIC_storageBucket,
  EXPO_PUBLIC_messagingSenderId,
  EXPO_PUBLIC_appId,
}

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
