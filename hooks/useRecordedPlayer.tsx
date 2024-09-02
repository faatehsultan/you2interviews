import { useState, useEffect } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import Toast from "react-native-root-toast";
import { Platform } from "react-native";
import { PermissionsAndroid } from "react-native";

interface UseRecordedPlayerReturn {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  isPlaying: boolean;
}

interface IFile {
  key: string;
  url: string;
  local_uri?: string;
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
  // const [cachedFiles, setCachedFiles] = useState<IFile[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const cloudPlayFile = useCache(CACHE_KEYS.CLOUD_PLAY_FILE);

  // const cacheAudioFile = async (files: IFile[]): Promise<IFile[]> => {
  //   try {
  //     const cachedFiles: IFile[] = [];
  //     for (const file of files) {
  //       const fileUri = `${FileSystem.documentDirectory}${file.key}`;

  //       const fileInfo = await FileSystem.getInfoAsync(fileUri);
  //       if (fileInfo.exists) {
  //         console.log(`File already cached: ${fileUri}`);
  //         cachedFiles.push({ ...file, local_uri: fileUri });
  //       } else {
  //         console.log("Downloading:", file.url, "to", fileUri);
  //         await FileSystem.downloadAsync(file.url, fileUri);
  //         console.log("Downloaded:", file.url, "to", fileUri);
  //         cachedFiles.push({ ...file, local_uri: fileUri });
  //       }
  //     }
  //     return cachedFiles;
  //   } catch (error) {
  //     Toast.show("Error caching audio files");
  //     console.error("Error caching audio files:", error);
  //     return [];
  //   }
  // };

  // useEffect(() => {
  //   const loadAudioFiles = async () => {
  //     try {
  //       if (cloudPlayFile.cache && cloudPlayFile.cache?.url) {
  //       }
  //     } catch (error) {
  //       console.error("Error loading audio files:", error);
  //     }
  //   };

  //   loadAudioFiles();
  // }, [cloudPlayFile.cache]);

  const play = async () => {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      } else if (cloudPlayFile?.cache && cloudPlayFile?.cache?.url) {
        const { sound: newSound, status } = await Audio.Sound.createAsync({
          uri: cloudPlayFile.cache?.url,
        });
        setSound(newSound);
        setIsPlaying(true);

        await newSound.playAsync();

        newSound.setOnPlaybackStatusUpdate(async (status: AVPlaybackStatus) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
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
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      // setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

  return { play, pause, stop, isPlaying };
};

export default useRecordedPlayer;
