import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useInitRtcEngine from "./useInitRtcEngine";
import {
  ClientRoleType,
  EarMonitoringFilterType,
  ErrorCodeType,
  LocalAudioStreamReason,
  LocalAudioStreamState,
  MediaDeviceType,
  RtcConnection,
} from "react-native-agora";
import * as agoraApi from "@/agora/api";
import { useSession } from "@/context/session";

export default function useBroadcaster() {
  const session = JSON.parse(useSession().session || "");

  const {
    channelId,
    setChannelId,
    token,
    setToken,
    uid,
    joinChannelSuccess,
    remoteUsers,
    engine,
  } =
    /**
     * Step 1: initRtcEngine
     */
    useInitRtcEngine();

  const [enableLocalAudio, setEnableLocalAudio] = useState(true);
  const [muteLocalAudioStream, setMuteLocalAudioStream] = useState(false);
  const [enableSpeakerphone, setEnableSpeakerphone] = useState(false);
  const [recordingSignalVolume, setRecordingSignalVolume] = useState(100);
  const [playbackSignalVolume, setPlaybackSignalVolume] = useState(100);
  const [includeAudioFilters, setIncludeAudioFilters] = useState(
    EarMonitoringFilterType.EarMonitoringFilterNone
  );
  const [enableInEarMonitoring, setEnableInEarMonitoring] = useState(false);
  const [inEarMonitoringVolume, setInEarMonitoringVolume] = useState(100);
  const [currentAuthToken, setCurrentAuthToken] = useState("");

  /**
   * Step 2: joinChannel
   */
  const joinChannel = async (channelName: string) => {
    console.log("joinChannel: ", channelName);
    if (!channelName) {
      console.log("channelId is invalid");
      alert("channelId is invalid");
      return;
    }
    setChannelId(channelName);

    // get auth token for the channel
    const tokenRes = await agoraApi.getAuthToken(channelName);

    if (tokenRes?.token) {
      // start joining channel
      // 1. Users can only see each other after they join the
      // same channel successfully using the same app id.
      // 2. If app certificate is turned on at dashboard, token is needed
      // when joining channel. The channel name and uid used to calculate
      // the token has to match the ones used for channel join

      console.log("======", tokenRes?.token);
      setToken(tokenRes?.token);

      engine.current.joinChannel(tokenRes?.token, channelName, uid, {
        // Make myself as the broadcaster to send stream to remote
        clientRoleType: tokenRes?.is_host
          ? ClientRoleType.ClientRoleBroadcaster
          : ClientRoleType.ClientRoleAudience,
      });

      console.log("---- engine: ", engine.current);

      if (tokenRes?.is_host) {
        _enableLocalAudio();
        unmuteLocalAudioStream();
        disableSpeakerphone();
      } else {
        disableLocalAudio();
        _enableSpeakerphone();
        _muteLocalAudioStream();
      }
    }
  };

  /**
   * Step 3-1-1 (Optional): enableLocalAudio
   */
  const _enableLocalAudio = () => {
    engine.current.enableLocalAudio(true);
    setEnableLocalAudio(true);
  };

  /**
   * Step 3-1-2 (Optional): disableLocalAudio
   */
  const disableLocalAudio = () => {
    engine.current.enableLocalAudio(false);
    setEnableLocalAudio(false);
  };

  /**
   * Step 3-2-1 (Optional): muteLocalAudioStream
   */
  const _muteLocalAudioStream = () => {
    engine.current.muteLocalAudioStream(true);
    setMuteLocalAudioStream(true);
  };

  /**
   * Step 3-2-2 (Optional): unmuteLocalAudioStream
   */
  const unmuteLocalAudioStream = () => {
    engine.current.muteLocalAudioStream(false);
    setMuteLocalAudioStream(false);
  };

  /**
   * Step 3-3-1 (Optional): enableSpeakerphone
   */
  const _enableSpeakerphone = () => {
    engine.current.setEnableSpeakerphone(true);
    setEnableSpeakerphone(true);
  };

  /**
   * Step 3-3-2 (Optional): disableSpeakerphone
   */
  const disableSpeakerphone = () => {
    engine.current.setEnableSpeakerphone(false);
    setEnableSpeakerphone(false);
  };

  /**
   * Step 3-4 (Optional): adjustRecordingSignalVolume
   */
  const adjustRecordingSignalVolume = () => {
    engine.current.adjustRecordingSignalVolume(recordingSignalVolume);
  };

  /**
   * Step 3-5 (Optional): adjustPlaybackSignalVolume
   */
  const adjustPlaybackSignalVolume = () => {
    engine.current.adjustPlaybackSignalVolume(playbackSignalVolume);
  };

  /**
   * Step 3-6-1 (Optional): enableInEarMonitoring
   */
  const _enableInEarMonitoring = () => {
    if (
      engine.current.enableInEarMonitoring(true, includeAudioFilters) ===
      ErrorCodeType.ErrOk
    ) {
      setEnableInEarMonitoring(true);
    }
  };

  /**
   * Step 3-6-2 (Optional): setInEarMonitoringVolume
   */
  const _setInEarMonitoringVolume = () => {
    engine.current.setInEarMonitoringVolume(inEarMonitoringVolume);
  };

  /**
   * Step 3-6-3 (Optional): disableInEarMonitoring
   */
  const disableInEarMonitoring = () => {
    if (
      engine.current.enableInEarMonitoring(false, includeAudioFilters) ===
      ErrorCodeType.ErrOk
    ) {
      setEnableInEarMonitoring(false);
    }
  };

  /**
   * Step 4: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
    setChannelId("");
  };

  const onAudioDeviceStateChanged = useCallback(
    (deviceId: string, deviceType: number, deviceState: number) => {
      console.log(
        "onAudioDeviceStateChanged",
        "deviceId",
        deviceId,
        "deviceType",
        deviceType,
        "deviceState",
        deviceState
      );
    },
    []
  );

  const onAudioDeviceVolumeChanged = useCallback(
    (deviceType: MediaDeviceType, volume: number, muted: boolean) => {
      console.log(
        "onAudioDeviceVolumeChanged",
        "deviceType",
        deviceType,
        "volume",
        volume,
        "muted",
        muted
      );
    },
    []
  );

  const onLocalAudioStateChanged = useCallback(
    (
      connection: RtcConnection,
      state: LocalAudioStreamState,
      error: LocalAudioStreamReason
    ) => {
      console.log(
        "onLocalAudioStateChanged",
        "connection",
        connection,
        "state",
        state,
        "error",
        error
      );
    },
    []
  );

  const onAudioRoutingChanged = useCallback((routing: number) => {
    console.log("onAudioRoutingChanged", "routing", routing);
  }, []);

  useEffect(() => {
    engine.current.addListener(
      "onAudioDeviceStateChanged",
      onAudioDeviceStateChanged
    );
    engine.current.addListener(
      "onAudioDeviceVolumeChanged",
      onAudioDeviceVolumeChanged
    );
    engine.current.addListener(
      "onLocalAudioStateChanged",
      onLocalAudioStateChanged
    );
    engine.current.addListener("onAudioRoutingChanged", onAudioRoutingChanged);

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeListener(
        "onAudioDeviceStateChanged",
        onAudioDeviceStateChanged
      );
      engineCopy.removeListener(
        "onAudioDeviceVolumeChanged",
        onAudioDeviceVolumeChanged
      );
      engineCopy.removeListener(
        "onLocalAudioStateChanged",
        onLocalAudioStateChanged
      );
      engineCopy.removeListener("onAudioRoutingChanged", onAudioRoutingChanged);
    };
  }, [
    engine,
    onAudioDeviceStateChanged,
    onAudioDeviceVolumeChanged,
    onAudioRoutingChanged,
    onLocalAudioStateChanged,
  ]);

  return {
    joinChannel,
    leaveChannel,
  };
}
