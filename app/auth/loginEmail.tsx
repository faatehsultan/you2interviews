import AuthHeader from "@/components/AuthHeader";
import { Form } from "@/components/Form";
import { View, StyleSheet, Image } from "react-native";

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
  return (
    <View style={styles.baseContainer}>
      <AuthHeader />

      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} />

        <Form fields={formFields} buttonText="Log In" />
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
