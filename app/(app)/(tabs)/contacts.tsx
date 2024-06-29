import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/UI/Button";
import { useSession } from "@/context/session";

export default function Contacts() {
  const { signOut } = useSession();

  return (
    <View style={styles.container}>
      <Text>YOU'RE LOGGED IN</Text>
      <View style={{ marginTop: 50 }}>
        <Button title="Logout" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
