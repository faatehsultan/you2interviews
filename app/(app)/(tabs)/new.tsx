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
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from "react-native-agora";
import { AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN } from "@/constants/agora";
import firestore from "@react-native-firebase/firestore";
import { useSession } from "@/context/session";
import { formatTimer } from "@/utils";

// Define basic information
const appId = AGORA_APP_ID;
const token = AGORA_TOKEN;
const channelName = AGORA_CHANNEL;
const uid = 0; // Local user UID, no need to modify

const getPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default function NewRecording() {
  const bottomSheetRef = useRef(null);
  const [showRecordingForm, setShowRecordingForm] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [streamingStartTime, setStreamingStartTime] = useState(null);
  const { session } = useSession();
  const [isAudience, setIsAudience] = useState(false);
  const [timerVal, setTimeVal] = useState("00:00");

  useEffect(() => {
    (async () => {
      const target = (
        await firestore().collection("streamings").doc(channelName).get()
      ).data();
      if (target?.["broadcaster_uid"]) {
        setIsAudience(false);
        const startTime = (
          await firestore().collection("timelines").doc(channelName).get()
        ).data()?.["start_time"];
        if (startTime) {
          setStreamingStartTime(startTime);
        }
      } else {
        setIsAudience(true);
      }
    })();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleInitiateRecording = () => {
    setShowRecordingForm(true);
  };

  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Remote user UID

  // Initialize the engine when starting the App
  useEffect(() => {
    setupVideoSDKEngine();
  });

  useEffect(() => {
    console.log("fulll", isJoined, streamingStartTime)
    if (isJoined && streamingStartTime) {
      const intervalId = setInterval(() => {
        console.log("setting timer again")
        setTimeVal(formatTimer(streamingStartTime));
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isJoined, streamingStartTime]);

  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after checking and obtaining device permissions
      if (Platform.OS === "android") {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      // Register event callbacks
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log("success");
          setIsLive(true);
          setIsJoined(true);
          if (!isAudience) {
            firestore()
              .collection("streamings")
              .doc(channelName)
              .set({
                broadcaster_uid: JSON.parse(session)?.data?.user?.uid,
              });
            const curTime = new Date().toISOString();
            firestore().collection("timelines").doc(channelName).set({
              start_time: curTime,
            });
            setStreamingStartTime(curTime);
          }
        },
        onUserJoined: (_connection, Uid) => {
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          setRemoteUid(0);
        },
      });

      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Define the join method called after clicking the join channel button
  const join = async () => {
    console.log("is joined>>>>");
    if (isJoined) {
      return;
    }
    try {
      // Set the channel profile type to live broadcasting after joining the channel
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileBroadcasting
      );
      // Call the joinChannel method to join the channel
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        // Set the user role to broadcaster
        clientRoleType: isAudience
          ? ClientRoleType.ClientRoleAudience
          : ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };
  // Define the leave method called after clicking the leave channel button
  const leave = () => {
    try {
      // Call the leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      setIsLive(false);
      setIsOpen(true);
      if (!isAudience) {
        firestore().collection("streamings").doc(channelName).delete();
        firestore().collection("timelines").doc(channelName).set({
          end_time: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
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
                    console.log(sessionTitle);
                    setIsOpen(false);
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
            onPress={join}
          >
            <FontAwesome
              name="microphone"
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
          <Text style={{ fontSize: 10, marginTop: 20 }}>Tap to Go Live</Text>
          <Text style={{ marginTop: 50 }}>Session</Text>
          <Text style={{ fontSize: 20 }}>{sessionTitle}</Text>
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
        </>
      )}
    </View>
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
