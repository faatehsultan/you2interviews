import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import SearchTile from "@/components/SearchTile";
import * as agoraApi from "@/agora/api";
import { matchText } from "@/utils";
import moment from "moment";
import { BroadcasterContext } from "@/context/broadcaster";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-root-toast";

type Channel = {
  createdAt: any | null;
  hostUid: string;
  title: string;
  channel_name: string;
  channel_count: number;
};

const SEARCH_FIELDS = ["title"];

const TABS_LIST = ["live", "recorded"];

export default function Search() {
  const [activeTab, setActiveTab] = useState(TABS_LIST[0]);

  const [searchText, setSearchText] = useState("");
  const [baseChannelList, setBaseChannelsList] = useState<{
    live: Channel[];
    recorded: Channel[];
  }>({
    live: [],
    recorded: [],
  });

  const [channelsList, setChannelsList] = useState<Channel[]>([]);
  const [searchedChannels, setSearchedChannels] =
    useState<Channel[]>(channelsList);

  const [fetchingRecordedData, setFetchingRecordedData] =
    useState<Boolean>(false);
  const [fetchingChannelId, setFetchingChannelId] = useState<string>("");

  const playbackCache = useCache(CACHE_KEYS.PLAYBACK);
  const cloudPlayFile = useCache(CACHE_KEYS.CLOUD_PLAY_FILE);

  const isChannelCurrentlyJoined = (channelName: string) => {
    return playbackCache.cache?.channel_name === channelName;
  };

  const { joinChannelAsAudience } = useContext(BroadcasterContext);

  const fetchChannels = useCallback(async () => {
    const res = await agoraApi.getChannelsList();

    setBaseChannelsList(res);
  }, []);

  useEffect(() => {
    fetchChannels();
    const intervalId = setInterval(fetchChannels, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const performSearch = useCallback(
    (newlist = null) => {
      const searchSpace = newlist || channelsList;

      const matchedList = (
        !searchText
          ? matchText(searchText, searchSpace, SEARCH_FIELDS)
          : channelsList
      )?.filter((channel: Channel) => {
        if (activeTab === "recorded") {
          if (
            baseChannelList?.["live"]?.find(
              (item) => item?.channel_name === channel?.channel_name
            )
          ) {
            return false;
          }
        }

        return true;
      });
      console.log("channels: ", channelsList);

      setSearchedChannels(matchedList);
    },
    [searchText, channelsList]
  );

  useEffect(() => {
    performSearch();
  }, [searchText, channelsList]);

  useEffect(() => {
    if (baseChannelList) {
      setChannelsList(baseChannelList?.[activeTab]);
    }
  }, [activeTab, baseChannelList]);

  const handleClickSearchTile = async (item: Channel) => {
    if (activeTab === "live") {
      joinChannelAsAudience(item);
    } else {
      setFetchingRecordedData(true);
      setFetchingChannelId(item?.channel_name);
      const playableMp3File = await agoraApi.getMp3RecordedFile(
        item?.channel_name
      );

      console.log("==== file-=-=---", playableMp3File);

      if (playableMp3File && playableMp3File?.url) {
        const finalMp3 = {
          ...playableMp3File,
          url: playableMp3File?.url?.split("?")[0],
        };
        cloudPlayFile.setCache(finalMp3);
        playbackCache.setCache({
          title: item?.title,
          type: "recorded",
        });
        Toast.show("Session Buffering...");
      }

      setFetchingRecordedData(false);
      setFetchingChannelId("");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 20,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <TextInput
          placeholder="Search for a live stream..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchBar}
        />
      </View>
      <View style={styles.tabContainer}>
        {TABS_LIST.map((item, idx) => (
          <Pressable
            style={[styles.tab, activeTab == item && styles.activeTab]}
            onPress={() => {
              setActiveTab(item);
            }}
            key={idx}
          >
            <Text style={styles.tabText}>{item?.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ width: "100%", paddingHorizontal: 25 }}>
        <FlatList
          data={
            searchedChannels?.sort((a, b) =>
              moment(b.createdAt).diff(moment(a.createdAt))
            ) || []
          }
          renderItem={({ item }) => (
            <SearchTile
              title={
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    flexWrap: !fetchingRecordedData ? "wrap" : "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", width: "85%", fontSize: 16 }}
                  >
                    {item.title.length > 40
                      ? `${item.title.slice(0, 37)}...`
                      : item.title || "Unnamed"}
                    {"  "}
                    {isChannelCurrentlyJoined(item?.channel_name) && (
                      <FontAwesome
                        name="check"
                        size={18}
                        color={Colors.light.primary}
                      />
                    )}
                  </Text>
                  {fetchingRecordedData &&
                    fetchingChannelId === item?.channel_name && (
                      <ActivityIndicator size="small" />
                    )}
                  <Text
                    style={{
                      fontSize: 12,
                      color: "gray",
                      textAlign: "right",
                      width: "100%",
                    }}
                  >
                    {moment(item?.createdAt).fromNow()}
                  </Text>
                </View>
              }
              onPress={async () => {
                if (
                  !isChannelCurrentlyJoined(item?.channel_name) &&
                  !fetchingRecordedData
                ) {
                  await handleClickSearchTile(item);
                } else {
                  Toast.show("Exit the currently joined channel first!");
                }
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tabContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
    gap: 25,
  },
  tab: {
    paddingVertical: 7,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: "white",
  },
  activeTab: {
    backgroundColor: "rgba(8, 34, 183, 0.2)",
  },
  tabText: {
    fontWeight: "bold",
  },
  searchBar: {
    width: "100%",
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 50,
  },
});
