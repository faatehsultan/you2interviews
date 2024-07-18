import { Pressable, Text, StyleSheet } from "react-native";
import React from "react";

export default function SearchTile({ title, onPress }: any) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "grey",
    borderTopWidth: 1,
    padding: 15,
  },
});
