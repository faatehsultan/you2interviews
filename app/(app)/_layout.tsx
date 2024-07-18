import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../context/session";
import NonVerfiedEmailOverlay from "@/components/NonVerfiedEmailOverlay";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/auth/landing" />;
  }

  if (!session?.emailVerified) {
    return <NonVerfiedEmailOverlay />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
