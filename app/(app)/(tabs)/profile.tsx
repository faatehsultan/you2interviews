import { Form } from "@/components/Form";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-root-toast";
import { useSession } from "@/context/session";
import * as agoraApi from "@/agora/api";

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
    placeholder: "Update your password",
    secureTextEntry: true,
  },
];

export default function UpdateProfile() {
  const { session } = useSession();

  const handleUpdate = async (data: any) => {
    console.log("000data", data);
    if (session?.uid) {
      const response = await agoraApi.updateUserProfile(
        session?.uid,
        data?.name,
        data?.email,
        data?.password
      );
      console.log("-=----", response);
      if (response.uid) {
        Toast.show("Profile updated");
      }
    }
  };

  return (
    <View style={styles.baseContainer}>
      <Form
        fields={formFields}
        buttonText="Update"
        onSubmit={handleUpdate}
        initialValues={{
          email: session?.email,
          name: session?.displayName,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    paddingHorizontal: 40,
    width: "100%",
    height: "100%",
  },
});
