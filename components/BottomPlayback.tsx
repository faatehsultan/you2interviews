import { Text, View, Image } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import { BroadcasterContext } from "@/context/broadcaster";

const MAX_TITLE_LENGTH = 32;

export default function BottomPlayback() {
  const playbackCache = useCache(CACHE_KEYS.PLAYBACK);
  const recordingCache = useCache(CACHE_KEYS.RECORDING);

  const { leaveChannel, toggleMutePlayback, toggleMuteRecording } =
    useContext(BroadcasterContext);

  const handleMute = () => {
    if (playbackCache?.cache?.is_host) {
      toggleMuteRecording(!playbackCache?.cache?.is_muted);
    } else {
      toggleMutePlayback(!playbackCache?.cache?.is_muted);
    }

    playbackCache?.setCache({
      ...playbackCache?.cache,
      is_muted: !playbackCache?.cache?.is_muted,
    });
  };

  const getMuteIcon = useCallback(() => {
    if (playbackCache?.cache?.is_host) {
      return playbackCache?.cache?.is_muted ? "mic-off" : "mic";
    }
    return playbackCache.cache?.is_muted ? "volume-mute" : "volume-high";
  }, [playbackCache?.cache]);

  return (
    playbackCache?.cache && (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: Colors.light.background,
          width: "92%",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          padding: 10,
          borderColor: Colors.light.primary,
          borderWidth: 2,
        }}
      >
        <Image
          source={require("../assets/images/wave-sound.png")}
          style={{
            width: 30,
            height: 30,
            tintColor: Colors.light.primary,
            marginRight: 10,
          }}
        />
        <View style={{ width: "67%" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {(playbackCache?.cache?.title || "Not Playing").slice(
              0,
              MAX_TITLE_LENGTH
            )}
            {playbackCache?.cache?.title?.length > MAX_TITLE_LENGTH && "..."}
          </Text>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: "gray",
              }}
            >
              Host
            </Text>
            <Ionicons name="volume-high" color="gray" size={11} />
          </View>
        </View>
        {recordingCache?.cache?.sid && <RecordingFlashIcon />}
        <Ionicons.Button
          name={getMuteIcon()}
          color={Colors.light.primary}
          backgroundColor="transparent"
          size={23}
          onPress={handleMute}
        />
        {!playbackCache?.cache?.is_host && (
          <Ionicons.Button
            name="power"
            color={Colors.light.primary}
            backgroundColor="transparent"
            size={23}
            onPress={leaveChannel}
          />
        )}
      </View>
    )
  );
}

const RecordingFlashIcon = () => {
  const [iconOpacity, setIconOpacity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconOpacity((prev) => Math.floor(((prev + 0.1) % 1) * 100) / 100);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <Ionicons
      name="radio-button-on-outline"
      color="red"
      size={25}
      style={{ opacity: iconOpacity }}
    />
  );
};
