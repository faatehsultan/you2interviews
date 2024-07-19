import useBroadcasterBase from "@/hooks/useBroadcaster";
import React, { createContext, useState } from "react";

const BroadcasterContext = createContext({
  joinChannelAsHost: async (channelTitle: string): Promise<boolean> =>
    Promise.resolve(false),
  joinChannelAsAudience: async (channelObj: any): Promise<boolean> =>
    Promise.resolve(false),
  leaveChannel: () => {},
  isLoading: false,
  toggleMutePlayback: (mute: boolean) => {},
  toggleMuteRecording: (mute: boolean) => {},
});

const BroadcasterProvider = ({ children }: any) => {
  const {
    joinChannelAsHost,
    joinChannelAsAudience,
    leaveChannel,
    isLoading,
    toggleMutePlayback,
    toggleMuteRecording,
  } = useBroadcasterBase();

  return (
    <BroadcasterContext.Provider
      value={{
        joinChannelAsHost,
        joinChannelAsAudience,
        leaveChannel,
        isLoading,
        toggleMutePlayback,
        toggleMuteRecording,
      }}
    >
      {children}
    </BroadcasterContext.Provider>
  );
};

export { BroadcasterContext, BroadcasterProvider };
