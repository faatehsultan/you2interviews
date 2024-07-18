import HeaderPrimary from "@/components/HeaderPrimary";
import { Form } from "@/components/Form";
import { apiResetPassword } from "@/firebase/api";
import { router } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import Toast from "react-native-root-toast";

const formFields = [
  {
    label: "Email*",
    name: "email",
    placeholder: "DavideOretti@gmail.com",
  },
];

export default function ResetPassword() {
  const handleLogin = async (data: any) => {
    const response = await apiResetPassword(data?.email);

    Toast.show("Password reset link sent to your email");

    router.replace("/auth/loginEmail");
  };

  return (
    <View style={styles.baseContainer}>
      <HeaderPrimary />

      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} />

        <Form fields={formFields} buttonText="Reset" onSubmit={handleLogin} />
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
