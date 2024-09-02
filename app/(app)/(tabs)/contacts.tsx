import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import TextInput from "@/components/UI/TextInput";
import SearchTile from "@/components/SearchTile";
import * as agoraApi from "@/agora/api";
import { matchText } from "@/utils";
import { useSession } from "@/context/session";

type User = {
  uid: number | string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  photoURL: string;
};

const SEARCH_FIELDS = ["displayName", "email"];

export default function Contacts() {
  const [searchText, setSearchText] = useState("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<User[]>(usersList);
  const { session } = useSession();

  const fetchUsers = useCallback(async () => {
    const res = await agoraApi.getUsersList();

    setUsersList(res);
  }, []);

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const performSearch = useCallback(
    (newlist = null) => {
      if (!searchText) {
        setSearchedUsers(usersList);
        return;
      }
      const searchSpace = newlist || usersList;

      const matchedList = matchText(searchText, searchSpace, SEARCH_FIELDS);

      setSearchedUsers(matchedList);
    },
    [searchText, usersList]
  );

  useEffect(() => {
    performSearch();
  }, [searchText, usersList]);

  const handleClickSearchTile = (item: User) => {
    console.log("User: ", item);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", paddingHorizontal: 25 }}>
        <TextInput
          placeholder="Search for a user..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={searchedUsers}
          style={{
            marginTop: 30,
            borderBottomWidth: 1,
            borderBottomColor: "gray",
          }}
          renderItem={({ item }) => (
            <SearchTile
              title={
                <>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.displayName || "Unnamed"}
                    </Text>
                    <Text>{session?.uid === item.uid ? " (You)" : ""}</Text>
                  </Text>
                  <Text> ({item.email})</Text>
                </>
              }
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
