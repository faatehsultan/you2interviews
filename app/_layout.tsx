import { Slot } from "expo-router";
import { SessionProvider } from "../context/session";
import { SafeAreaView, StyleSheet } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

export default function Root() {
  return (
    <SessionProvider>
      <RootSiblingParent>
        <SafeAreaView style={styles.safeAreaContainer}>
          <Slot />
        </SafeAreaView>
      </RootSiblingParent>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
