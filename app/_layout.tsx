import { Slot } from "expo-router";
import { SessionProvider } from "../context/session";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect, useState } from "react";
import useCache, { CACHE_KEYS } from "@/redux/useCache";
import { apiGetDynamicEnvVars } from "@/firebase/api";
import { Colors } from "@/constants/Colors";

export default function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <SessionProvider>
            <RootSiblingParent>
              <SafeAreaView style={styles.safeAreaContainer}>
                <RootComponent />
              </SafeAreaView>
            </RootSiblingParent>
          </SessionProvider>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const RootComponent = () => {
  // const envCache = useCache(CACHE_KEYS.ENV);
  // const [loadingEnv, setLoadingEnv] = useState(true);

  // useEffect(() => {
  //   (async () => {
  //     setLoadingEnv(true);
  //     const envVars = await apiGetDynamicEnvVars();
  //     envCache.setCache(envVars);
  //     setLoadingEnv(false);
  //   })();
  // }, []);

  // return loadingEnv ? (
  //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //     <ActivityIndicator
  //       size="large"
  //       color={Colors.light.primary}
  //       style={{ flex: 1 }}
  //     />
  //   </View>
  // ) : (
  //   <Slot />
  // );

  return <Slot />;
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
