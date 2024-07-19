import BottomPlayback from "@/components/BottomPlayback";
import HeaderPrimary from "@/components/HeaderPrimary";
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.light.primary,
          headerLeft: () => <HeaderPrimary />,
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: Colors.light.primary,
            height: 55,
            paddingVertical: 5,
            borderTopLeftRadius: 10,
          },
          tabBarIconStyle: {
            color: "white",
          },
          tabBarLabelStyle: {
            color: "white",
            marginBottom: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "My Podcasts",
            tabBarIcon: () => (
              <FontAwesome size={28} name="microphone" color="white" />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: "Users",
            tabBarIcon: () => (
              <FontAwesome size={28} name="address-book" color="white" />
            ),
          }}
        />
        <Tabs.Screen
          name="new"
          options={{
            title: "New Session",
            tabBarIcon: () => (
              <FontAwesome
                size={46}
                name="plus-circle"
                color="white"
                style={{ transform: "translateY(-4px)" }}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: () => (
              <FontAwesome size={28} name="search" color="white" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: () => (
              <FontAwesome size={28} name="user" color="white" />
            ),
          }}
        />
      </Tabs>

      <View
        style={{
          position: "absolute",
          bottom: 52.5,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <BottomPlayback />
      </View>
    </View>
  );
}
