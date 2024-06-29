import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../context/session";

export default function AppLayout() {
  const { signIn, signOut, session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/auth/landing" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
