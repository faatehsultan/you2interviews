import { Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const MAX_TITLE_LENGTH = 32;

type Props = {
  title?: string;
};

export default function BottomPlayback({ title }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.light.background,
        width: "92%",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 10,
        borderColor: Colors.light.primary,
        borderWidth: 2,
      }}
    >
      <Image
        source={require("../assets/images/wave-sound.png")}
        style={{
          width: 30,
          height: 30,
          tintColor: Colors.light.primary,
          marginLeft: 10,
        }}
      />
      <View style={{ width: "70%" }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          {(title || "Not Playing").slice(0, MAX_TITLE_LENGTH)}
          {title?.length > MAX_TITLE_LENGTH && "..."}
        </Text>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "gray",
            }}
          >
            Host
          </Text>
          <FontAwesome name="volume-up" color="gray" size={11} />
        </View>
      </View>
      <FontAwesome.Button
        name="play"
        color={Colors.light.primary}
        backgroundColor="transparent"
      />
    </View>
  );
}
