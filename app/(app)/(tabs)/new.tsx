import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput as TextInputNative,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";
import Button from "@/components/UI/Button";
import { BroadcasterContext } from "@/context/broadcaster";
import { startAutoRecording, stopRecording } from "@/agora/api";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import Toast from "react-native-root-toast";

const getPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

getPermission();

type AutoRecordResType = {
  resourceId: string;
  sid: string;
  cname: string;
  requesterUid: string;
  requesterToken: string;
  targetUid: string;
};

export default function NewRecording() {
  const bottomSheetRef = useRef(null);
  const [showRecordingForm, setShowRecordingForm] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [timerVal, setTimeVal] = useState("00:00");
  const [isLoadingStartRecording, setIsLoadingStartRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const playbackCache = useCache(CACHE_KEYS.PLAYBACK);
  const recordingCache = useCache(CACHE_KEYS.RECORDING);

  const { joinChannelAsHost, leaveChannel, isLoading } =
    useContext(BroadcasterContext);

  // const streamingStartTimeCache = useCache(CACHE_KEYS.STREAMING_START_TIME);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const handleInitiateRecording = () => {
    setShowRecordingForm(true);
  };

  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel

  // useEffect(() => {
  //   if (isJoined && streamingStartTimeCache.value) {
  //     const interval = setInterval(() => {
  //       setTimeVal(formatTimer(Date.now() - streamingStartTimeCache.value));
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [isJoined, streamingStartTimeCache]);

  const join = async () => {
    if (isJoined) {
      return;
    }

    const success = await joinChannelAsHost(sessionTitle);

    if (success) {
      // streamingStartTimeCache.set(moment().toISOString());
      setIsJoined(true);
    }
  };

  const leave = async () => {
    try {
      await stopRecordingFunction();
      setIsJoined(false);
      setIsOpen(true);
      leaveChannel();
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecordingFunction = async () => {
    if (!isRecording) return;
    const cache: AutoRecordResType = recordingCache?.cache;
    const res = await stopRecording(
      cache?.cname,
      cache?.requesterUid,
      cache?.sid,
      cache?.resourceId
    );

    if (res?.serverResponse?.uploadingStatus) {
      Toast.show("Recording uploaded successfully");
    } else {
      Toast.show("Recording upload failed");
    }

    setIsRecording(false);
    recordingCache?.setCache(null);
  };

  const handleRecording = async () => {
    setIsLoadingStartRecording(true);
    if (isRecording) {
      // stop it
      await stopRecordingFunction();
    } else {
      // start it
      const res: AutoRecordResType = await startAutoRecording(
        playbackCache?.cache?.channel_name,
        playbackCache?.cache?.numeric_uid
      );

      if (res?.sid) {
        setIsRecording(true);
        recordingCache?.setCache(res);
        Toast.show("Recording started");
      } else {
        Toast.show("Recording failed");
      }
    }
    setIsLoadingStartRecording(false);
  };

  return (
    <>
      <View style={styles.container}>
        {isOpen ? (
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["70%", "100%"]}
          >
            <BottomSheetView style={styles.contentContainer}>
              {!showRecordingForm ? (
                <Pressable
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 13,
                  }}
                  onPress={handleInitiateRecording}
                >
                  <FontAwesome
                    name="microphone"
                    size={18}
                    color="white"
                    style={{
                      backgroundColor: Colors.light.primary,
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                      borderRadius: 100,
                    }}
                  />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Go Live
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.recForm}>
                  <TextInputNative
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "grey",
                      padding: 8,
                    }}
                    placeholder={"Enter Session Title"}
                    onChangeText={(val) => setSessionTitle(val)}
                    value={sessionTitle}
                  />
                  <Button
                    title="Start Now"
                    onPress={() => {
                      if (!sessionTitle) alert("Please enter session title");
                      else setIsOpen(false);
                    }}
                  />
                  <Pressable onPress={() => setShowRecordingForm(false)}>
                    <Text
                      style={{
                        textAlign: "center",
                        textDecorationLine: "underline",
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              )}
            </BottomSheetView>
          </BottomSheet>
        ) : (
          <>
            {/* <Text style={styles.timerLabel}>{timerVal}</Text> */}
            <Pressable
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 13,
                marginTop: 120,
              }}
              onPress={isJoined ? leave : join}
            >
              <FontAwesome
                name={isJoined ? "pause" : "microphone"}
                size={50}
                color="white"
                style={{
                  backgroundColor: Colors.light.primary,
                  paddingVertical: 14,
                  paddingHorizontal: 22,
                  borderRadius: 100,
                }}
              />
            </Pressable>
            {!isLoading ? (
              <Text style={{ fontSize: 10, marginTop: 20 }}>
                Tap to {isJoined ? "Stop" : "Go Live"}
              </Text>
            ) : (
              <ActivityIndicator
                style={{ marginTop: 20 }}
                size="large"
                color={Colors.light.primary}
              />
            )}
            <Text style={{ marginTop: 50, marginBottom: 20 }}>Session</Text>
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              {sessionTitle}
            </Text>

            {isJoined && (
              <Pressable
                style={{
                  marginTop: 50,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  backgroundColor: Colors.light.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 50,
                }}
                disabled={isLoadingStartRecording}
                onPress={handleRecording}
              >
                {isLoadingStartRecording ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <FontAwesome
                    name={isRecording ? "pause" : "play"}
                    size={19}
                    color="white"
                  />
                )}
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  {isRecording ? "Stop" : "Start"} Recording
                </Text>
              </Pressable>
            )}

            {!isJoined && (
              <Pressable onPress={leave} style={{ marginTop: 50 }}>
                <Text
                  style={{
                    textAlign: "center",
                    textDecorationLine: "underline",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: 30,
    flex: 1,
    alignItems: "center",
    padding: 40,
  },
  recForm: {
    paddingTop: 10,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 25,
    width: "100%",
  },
  timerLabel: {
    fontSize: 30,
    marginTop: 20,
  },
});
