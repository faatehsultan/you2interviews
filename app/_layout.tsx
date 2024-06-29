import { Slot } from "expo-router";
import { SessionProvider } from "../context/session";
import { SafeAreaView, StyleSheet } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SessionProvider>
          <RootSiblingParent>
            <SafeAreaView style={styles.safeAreaContainer}>
              <Slot />
            </SafeAreaView>
          </RootSiblingParent>
        </SessionProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
