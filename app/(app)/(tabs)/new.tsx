import {
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput as TextInputNative,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";
import Button from "@/components/UI/Button";
import firestore from "@react-native-firebase/firestore";
import { useSession } from "@/context/session";
import { formatTimer, parseSessionTitleToChannel } from "@/utils";
import Broadcaster from "@/components/Broadcaster";
import useBroadcaster from "@/hooks/useBroadcaster";

const getPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

getPermission();

export default function NewRecording() {
  const bottomSheetRef = useRef(null);
  const [showRecordingForm, setShowRecordingForm] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [streamingStartTime, setStreamingStartTime] = useState(null);
  const [isAudience, setIsAudience] = useState(false);
  const [timerVal, setTimeVal] = useState("00:00");

  const { joinChannel, leaveChannel } = useBroadcaster();

  // useEffect(() => {
  //   (async () => {
  //     const target = (
  //       await firestore().collection("streamings").doc(channelName).get()
  //     ).data();
  //     if (target?.["broadcaster_uid"]) {
  //       setIsAudience(false);
  //       const startTime = (
  //         await firestore().collection("timelines").doc(channelName).get()
  //       ).data()?.["start_time"];
  //       if (startTime) {
  //         setStreamingStartTime(startTime);
  //       }
  //     } else {
  //       setIsAudience(true);
  //     }
  //   })();
  // }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleInitiateRecording = () => {
    setShowRecordingForm(true);
  };

  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel

  useEffect(() => {
    if (isJoined && streamingStartTime) {
      const intervalId = setInterval(() => {
        console.log("setting timer again");
        setTimeVal(formatTimer(streamingStartTime));
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isJoined, streamingStartTime]);

  const join = async () => {
    console.log("is joined>>>>", isJoined);
    if (isJoined) {
      return;
    }

    await joinChannel(parseSessionTitleToChannel(sessionTitle));
    setIsJoined(true);
    try {
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      setIsJoined(false);
      setIsOpen(true);
      leaveChannel();
    } catch (e) {
      console.log(e);
    }
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
                    Recording
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
            <Text style={styles.timerLabel}>{timerVal}</Text>
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
            <Text style={{ fontSize: 10, marginTop: 20 }}>
              Tap to {isJoined ? "Stop" : "Go Live"}
            </Text>
            <Text style={{ marginTop: 50 }}>Session</Text>
            <Text style={{ fontSize: 20 }}>{sessionTitle}</Text>
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
