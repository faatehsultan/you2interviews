import useInitRtcEngine from "./useInitRtcEngine";
import { ClientRoleType } from "react-native-agora";
import * as agoraApi from "@/agora/api";
import { processChannelBeforeJoining } from "@/utils";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import { useEffect, useState } from "react";

export default function useBroadcaster() {
  const {
    channelId,
    setChannelId,
    token,
    setToken,
    uid,
    joinChannelSuccess,
    remoteUsers,
    engine,
  }: any = useInitRtcEngine();

  const [loading, setLoading] = useState(false);

  const playbackCache = useCache(CACHE_KEYS.PLAYBACK);

  const joinChannelAsHost = async (channelTitle: string) => {
    if (!channelTitle) {
      console.log("Channel Title is invalid");
      alert("Channel Title is invalid");
      return false;
    }

    console.log("joinChannel requested HOST: ", channelTitle);

    setLoading(true);
    const { channelName, token } = await processChannelBeforeJoining(
      channelTitle,
      uid
    );

    if (token && channelName) {
      setChannelId(channelName);
      setToken(token);

      engine.current.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: false,
      });

      playbackCache.setCache({
        title: channelTitle,
        channel_name: channelName,
        is_host: true,
      });

      toggleMutePlayback(true);

      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const joinChannelAsAudience = async (channelObj: any) => {
    if (!channelObj.channel_name) {
      console.log("Channel Name is invalid");
      alert("Channel Name is invalid");
      return false;
    }

    console.log("joinChannel requested AUDIENCE: ", channelObj.channel_name);

    setLoading(true);
    const tokenRes = await agoraApi.getAuthToken(channelObj.channel_name);

    if (tokenRes?.token && channelObj.channel_name) {
      setChannelId(channelObj.channel_name);
      setToken(tokenRes?.token);

      engine.current.joinChannel(
        tokenRes?.token,
        channelObj.channel_name,
        uid,
        {
          clientRoleType: ClientRoleType.ClientRoleAudience,
        }
      );

      playbackCache.setCache({
        title: channelObj.title,
        channel_name: channelObj.channel_name,
        is_host: false,
      });

      toggleMuteRecording(true);

      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const toggleMutePlayback = (mute: boolean) => {
    engine.current.adjustPlaybackSignalVolume(mute ? 0 : 100);
  };

  const toggleMuteRecording = (mute: boolean) => {
    engine.current.muteRecordingSignal(mute);
  };

  const leaveChannel = () => {
    engine.current.leaveChannel();
    setChannelId("");
    playbackCache.clearCache();
  };

  return {
    joinChannelAsHost,
    joinChannelAsAudience,
    leaveChannel,
    isLoading: loading,
    toggleMutePlayback,
    toggleMuteRecording,
  };
}
