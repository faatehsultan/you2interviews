import useInitRtcEngine from "./useInitRtcEngine";
import { ClientRoleType } from "react-native-agora";
import * as agoraApi from "@/agora/api";

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

  const joinChannelAsHost = async (channelName: string) => {
    if (!channelName) {
      console.log("channelId is invalid");
      alert("channelId is invalid");
      return false;
    }

    console.log("joinChannel requested: ", channelName);

    const allChannels = (await agoraApi.getChannelsList())?.channels?.data
      ?.channels;

    if (allChannels?.find((c: any) => c.channel_name === channelName)) {
      console.log("channel already exists");
      alert("Broadcast by this title already started by someone");
      return false;
    }

    setChannelId(channelName);

    const tokenRes = await agoraApi.getAuthToken(channelName);

    if (tokenRes?.token) {
      setToken(tokenRes?.token);

      engine.current.joinChannel(tokenRes?.token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: false,
      });
      return true;
    }

    return false;
  };

  const leaveChannel = () => {
    engine.current.leaveChannel();
    setChannelId("");
  };

  return {
    joinChannelAsHost,
    leaveChannel,
  };
}
