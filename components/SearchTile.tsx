import { Pressable, Text, StyleSheet } from "react-native";
import React from "react";

export default function SearchTile({ title, onPress }: any) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {typeof title === "string" ? <Text>{title}</Text> : title}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "grey",
    borderTopWidth: 1,
    padding: 10,
  },
});
