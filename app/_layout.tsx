import { Slot } from "expo-router";
import { SessionProvider } from "../context/session";
import { SafeAreaView, StyleSheet } from "react-native";

export default function Root() {
  return (
    <SessionProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        <Slot />
      </SafeAreaView>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
