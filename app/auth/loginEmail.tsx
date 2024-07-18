import HeaderPrimary from "@/components/HeaderPrimary";
import { Form } from "@/components/Form";
import { useSession } from "@/context/session";
import { apiLoginWithEmail } from "@/firebase/api";
import { router } from "expo-router";
import { View, StyleSheet, Image, Pressable, Text } from "react-native";
import Toast from "react-native-root-toast";

const formFields = [
  {
    label: "Email*",
    name: "email",
    placeholder: "DavideOretti@gmail.com",
  },
  {
    label: "Password*",
    name: "password",
    placeholder: "Enter your Password",
    secureTextEntry: true,
  },
];

export default function LoginEmail() {
  const { signIn } = useSession();

  const handleLogin = async (data: any) => {
    const response = await apiLoginWithEmail(data?.email, data?.password);

    if (response.success && response.data?.user) {
      signIn(response.data?.user);

      router.replace("/");
    } else {
      Toast.show(response?.data?.message || "User not found");
    }
  };

  return (
    <View style={styles.baseContainer}>
      <HeaderPrimary />

      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} />

        <Form fields={formFields} buttonText="Log In" onSubmit={handleLogin} />

        <Pressable
          onPress={() => router.push("/auth/resetPassword")}
          style={{ marginTop: 30 }}
        >
          <Text
            style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}
          >
            Forgot Password? Click Here
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    padding: 40,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  inputsContainer: {
    marginTop: 45,
    width: "100%",
    gap: 15,
  },
});
