import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

type ButtonProps = {
  title: string;
  onPress?: Function;
  style?: object;
  textStyle?: object;
  mode?: "filled" | "outlined";
  imageComp?: any;
};

export default function Button({
  title = "3123",
  onPress = () => {},
  style,
  textStyle,
  mode = "filled",
  imageComp = null,
}: ButtonProps) {
  return (
    <Pressable
      style={{
        ...styles.btn,
        backgroundColor: mode == "filled" ? "#1E68D7" : "transparent",
        borderColor: mode == "filled" ? "transparent" : Colors.light.text,
        ...style,
      }}
      onPress={() => onPress()}
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
  );
}

const styles = StyleSheet.create({
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
  },
  text: {
    fontSize: 13,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});
