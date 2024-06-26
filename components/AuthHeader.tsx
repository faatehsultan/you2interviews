import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function AuthHeader() {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        if (router.canGoBack()) router.back();
      }}
    >
      <Image source={require("../assets/images/back-icon.png")} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});
