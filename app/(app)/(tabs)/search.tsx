import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import TextInput from "@/components/UI/TextInput";
import SearchTile from "@/components/SearchTile";
import * as agoraApi from "@/agora/api";
import { matchText, parseSessionTitleToChannel } from "@/utils";
import useCache, { CACHE_KEYS } from "@/redux/useCache";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [channelsList, setChannelsList] = useState([]);
  const [searchedChannels, setSearchedChannels] = useState(channelsList);
  const playbackCache = useCache(CACHE_KEYS.PLAYBACK);

  const fetchChannels = useCallback(async () => {
    const res = await agoraApi.getChannelsList();

    const channels = res?.channels?.data?.channels?.map((c) => ({
      ...c,
      title: parseSessionTitleToChannel(c.channel_name, true),
    }));

    setChannelsList(channels);
    performSearch(channels);
  }, []);

  useEffect(() => {
    fetchChannels();
    const intervalId = setInterval(fetchChannels, 4000);
    return () => clearInterval(intervalId);
  }, []);

  const performSearch = useCallback(async (newlist = null) => {
    if (!searchText) {
      setSearchedChannels(channelsList);
      return;
    }
    const searchSpace = newlist || channelsList;

    const matchedList = matchText(
      searchText,
      searchSpace?.map((c) => c.title)
    );

    setSearchedChannels(
      searchSpace.filter((c) => matchedList.includes(c.title))
    );
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchText]);

  const handleClickSearchTile = (item) => {
    const channelName = parseSessionTitleToChannel(item.title);
    console.log("channelName: ", channelName);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", paddingHorizontal: 25 }}>
        <TextInput
          placeholder="Search Live Broadcasts"
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={channelsList.map((c) => ({
            ...c,
            title: parseSessionTitleToChannel(c.channel_name, true),
          }))}
          style={{
            marginTop: 30,
            borderBottomWidth: 1,
            borderBottomColor: "gray",
          }}
          renderItem={({ item }) => (
            <SearchTile
              title={item.title}
              onPress={() => {
                handleClickSearchTile(item);
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
});
