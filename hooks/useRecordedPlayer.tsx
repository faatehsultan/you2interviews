import { useState } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import { Platform } from "react-native";
import { PermissionsAndroid } from "react-native";

interface UseRecordedPlayerReturn {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  isPlaying: boolean;
  isPaused: boolean;
}

const getPermission = async () => {
  if (Platform.OS === "android") {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.error("Permission error:", err);
    }
  }
};

getPermission();

const useRecordedPlayer = (): UseRecordedPlayerReturn => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cloudPlayFile = useCache(CACHE_KEYS.CLOUD_PLAY_FILE);
  const playbackCache = useCache(CACHE_KEYS.PLAYBACK);

  const play = async () => {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
        setIsPaused(false);
      } else if (cloudPlayFile?.cache && cloudPlayFile?.cache?.url) {
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: cloudPlayFile.cache?.url,
        });
        setSound(newSound);
        setIsPlaying(true);
        setIsPaused(false);

        await newSound.playAsync();

        newSound.setOnPlaybackStatusUpdate(async (status: AVPlaybackStatus) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setIsPaused(false);

            cloudPlayFile?.setCache(null);
            newSound.unloadAsync();
          }
        });
      }
    } catch (error) {
      console.error("Error during playback:", error);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setIsPaused(false);

      cloudPlayFile?.setCache(null);
      playbackCache?.setCache(null);
    }
  };

  return { play, pause, stop, isPlaying, isPaused };
};

export default useRecordedPlayer;
