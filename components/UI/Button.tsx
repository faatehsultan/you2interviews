import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

type ButtonProps = {
  title: string;
  onPress?: Function;
  style?: object;
  textStyle?: object;
  mode?: "filled" | "outlined";
  imageComp?: any;
  loading?: boolean;
};

export default function Button({
  title = "",
  onPress = () => {},
  style,
  textStyle,
  mode = "filled",
  imageComp = null,
  loading = false,
}: ButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={{
          ...styles.btn,
          backgroundColor: mode == "filled" ? "#1E68D7" : "transparent",
          borderColor: mode == "filled" ? "transparent" : Colors.light.text,
          opacity: loading ? 0.5 : 1,
          ...style,
        }}
        onPress={() => onPress()}
        disabled={loading}
      >
        {imageComp}
        <Text
          style={{
            ...styles.text,
            color: mode == "filled" ? "#ffffff" : Colors.light.text,
            ...textStyle,
          }}
        >
          {title}
        </Text>
        {imageComp && <View style={{ opacity: 0 }}>{imageComp}</View>}
      </Pressable>
      {loading && (
        <ActivityIndicator
          color={mode == "filled" ? "#ffffff" : Colors.light.primary}
          style={styles.loader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    width: "100%",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    position: "relative",
  },
  text: {
    fontSize: 13,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});
