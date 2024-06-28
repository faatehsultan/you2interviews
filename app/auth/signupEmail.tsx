import AuthHeader from "@/components/AuthHeader";
import { Form } from "@/components/Form";
import { View, StyleSheet, Image, Pressable, Text } from "react-native";
import { apiSignupWithEmail } from "@/firebase/api";
import { router } from "expo-router";
import Toast from "react-native-root-toast";

const formFields = [
  {
    label: "Nickname*",
    name: "name",
    placeholder: "Davide Oretti",
  },
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

export default function SignupEmail() {
  const handleSignup = async (data: any) => {
    const response = await apiSignupWithEmail(
      data?.email,
      data?.password,
      data?.name
    );

    if (response.success && response.data?.user) {
      Toast.show("User registered! please login");

      router.replace("/auth/loginEmail");
    }
  };

  return (
    <View style={styles.baseContainer}>
      <AuthHeader />

      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} />

        <Form
          fields={formFields}
          buttonText="Sign Up"
          onSubmit={handleSignup}
        />

        <Pressable style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12 }}>Already have account? login now</Text>
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
