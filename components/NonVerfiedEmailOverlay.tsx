import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Button from "./UI/Button";
import { useSession } from "@/context/session";

export default function NonVerfiedEmailOverlay() {
  const { signOut } = useSession();

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Image source={require("../assets/images/logo.png")} />

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 23,
          color: "white",
          textAlign: "center",
        }}
      >
        Email Not Verified
      </Text>
      <Text style={{ color: "white", textAlign: "center" }}>
        Please click the link sent to your email to verify your account and
        login again
      </Text>

      <View style={{ marginTop: 20, gap: 20 }}>
        <Button
          title="Logout"
          mode="outlined"
          style={{ borderColor: "white" }}
          textStyle={{ color: "white" }}
          onPress={signOut}
        />
      </View>

      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.light.primary}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaContainer: {
    padding: 40,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
  },
});
