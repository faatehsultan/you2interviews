import { useCallback, useEffect, useRef, useState } from "react";
import createAgoraRtcEngine, {
  ChannelProfileType,
  ErrorCodeType,
  IRtcEngineEx,
  RemoteAudioStats,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from "react-native-agora";

import Config from "@/config/agora.config";
import * as log from "@/utils/log";
import { askMediaAccess } from "@/utils/permissions";
import { useSession } from "@/context/session";

const useInitRtcEngine = (
  enableVideo: boolean = false,
  listenUserJoinOrLeave: boolean = true
) => {
  if (!Config.appId) {
    console.log(`appId is invalid`);
    alert(`appId is invalid`);
    return;
  }

  const [appId] = useState(Config.appId);
  const [channelId, setChannelId] = useState("");
  const [token, setToken] = useState("");

  const { session } = useSession();
  const [uid, setUid] = useState(session?.uid);

  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [startPreview, setStartPreview] = useState(false);

  const engine = useRef<IRtcEngineEx>(createAgoraRtcEngine() as IRtcEngineEx);

  const initRtcEngine = useCallback(async () => {
    if (!appId) {
      log.error(`appId is invalid`);
    }

    const success = engine.current.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    console.log("initRtcEngine successSS: ", success);


    // Need granted the microphone permission
    await askMediaAccess(["android.permission.RECORD_AUDIO"]);

    // Only need to enable audio on this case
    engine.current.enableAudio();

    if (enableVideo) {
      // Need granted the camera permission
      await askMediaAccess(["android.permission.CAMERA"]);

      // Need to enable video on this case
      // If you only call `enableAudio`, only relay the audio stream to the target channel
      engine.current.enableVideo();

      // Start preview before joinChannel
      engine.current.startPreview();
      setStartPreview(true);
    }
  }, [appId, enableVideo]);

  const onError = useCallback((err: ErrorCodeType, msg: string) => {
    log.info("onError", "err", err, "msg", msg);
  }, []);

  const onJoinChannelSuccess = useCallback(
    (connection: RtcConnection, elapsed: number) => {
      log.info(
        "onJoinChannelSuccess",
        "connection",
        connection,
        "elapsed",
        elapsed
      );
      if (
        connection.channelId === channelId &&
        (connection.localUid === uid || uid === "0")
      ) {
        setJoinChannelSuccess(true);
      }
    },
    [channelId, uid]
  );

  const onLeaveChannel = useCallback(
    (connection: RtcConnection, stats: RtcStats) => {
      log.info("onLeaveChannel", "connection", connection, "stats", stats);
      if (
        connection.channelId === channelId &&
        (connection.localUid === uid || uid === "0")
      ) {
        setJoinChannelSuccess(false);
        setRemoteUsers([]);
      }
    },
    [channelId, uid]
  );

  const onUserJoined = useCallback(
    (connection: RtcConnection, remoteUid: number, elapsed: number) => {
      log.info(
        "onUserJoined",
        "connection",
        connection,
        "remoteUid",
        remoteUid,
        "elapsed",
        elapsed
      );
      if (
        connection.channelId === channelId &&
        (connection.localUid === uid || uid === "0")
      ) {
        setRemoteUsers((prev) => {
          if (prev === undefined) return [];
          return [...prev, remoteUid];
        });
      }
    },
    [channelId, uid]
  );

  const onUserOffline = useCallback(
    (
      connection: RtcConnection,
      remoteUid: number,
      reason: UserOfflineReasonType
    ) => {
      log.info(
        "onUserOffline",
        "connection",
        connection,
        "remoteUid",
        remoteUid,
        "reason",
        reason
      );
      if (
        connection.channelId === channelId &&
        (connection.localUid === uid || uid === "0")
      ) {
        setRemoteUsers((prev) => {
          if (prev === undefined) return [];
          return prev!.filter((value) => value !== remoteUid);
        });
      }
    },
    [channelId, uid]
  );

  const onRemoteAudioStats = useCallback(
    (connection: RtcConnection, stats: RemoteAudioStats) => {
      log.info("onRemoteAudioStats", "connection", connection, "stats", stats);
    },
    []
  );

  useEffect(() => {
    (async () => {
      await initRtcEngine();
    })();

    const engineCopy = engine.current;
    return () => {
      engineCopy.release();
    };
  }, [engine, initRtcEngine]);

  useEffect(() => {
    engine.current.addListener("onError", onError);
    engine.current.addListener("onRemoteAudioStats", onRemoteAudioStats);
    engine.current.addListener("onJoinChannelSuccess", onJoinChannelSuccess);
    engine.current.addListener("onLeaveChannel", onLeaveChannel);
    if (listenUserJoinOrLeave) {
      engine.current.addListener("onUserJoined", onUserJoined);
      engine.current.addListener("onUserOffline", onUserOffline);
    }

    const engineCopy = engine.current;
    return () => {
      engineCopy.removeListener("onError", onError);
      engineCopy.removeListener("onJoinChannelSuccess", onJoinChannelSuccess);
      engineCopy.removeListener("onLeaveChannel", onLeaveChannel);
      if (listenUserJoinOrLeave) {
        engineCopy.removeListener("onUserJoined", onUserJoined);
        engineCopy.removeListener("onUserOffline", onUserOffline);
      }
    };
  }, [
    engine,
    initRtcEngine,
    onError,
    onJoinChannelSuccess,
    onLeaveChannel,
    onUserJoined,
    onUserOffline,
    listenUserJoinOrLeave,
  ]);

  return {
    appId,
    channelId,
    setChannelId,
    token,
    setToken,
    uid,
    setUid,
    joinChannelSuccess,
    setJoinChannelSuccess,
    remoteUsers,
    setRemoteUsers,
    startPreview,
    engine,
  };
};
export default useInitRtcEngine;
