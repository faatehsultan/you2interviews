import Button from "@/components/UI/Button";
import { router } from "expo-router";
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

export default function Landing() {
  const handleGoogleSignin = () => {
    console.log("login with google triggered");
  };

  return (
    <View style={styles.baseContainer}>
      <ImageBackground
        style={styles.imageBackground}
        source={require("../../assets/images/mic-bg.png")}
      >
        <View style={styles.container}>
          <Image source={require("../../assets/images/logo.png")} />
          <Text style={styles.headline}>
            build a new audio live room app similar to Pod Bean
          </Text>

          <View style={styles.btnContainer}>
            <Button
              title="Sign Up Free"
              onPress={() => router.push("/auth/signupEmail")}
            />
            <Button
              title="Continue with Google"
              mode="outlined"
              imageComp={
                <Image
                  source={require("../../assets/images/icon_google.png")}
                />
              }
              onPress={handleGoogleSignin}
            />
            <Button
              title="Continue with Facebook"
              mode="outlined"
              imageComp={
                <Image
                  source={require("../../assets/images/icon_facebook.png")}
                />
              }
            />
          </View>

          <View style={styles.bottomLogin}>
            <Pressable onPress={() => router.push("/auth/loginEmail")}>
              <Text>Log In</Text>
            </Pressable>
            <Text>|</Text>
            <Pressable>
              <Text>Skip</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.TCText}>
          By proceeding you agree to our{" "}
          <Text style={{ textDecorationLine: "underline" }}>Terms of Use</Text>{" "}
          and{" "}
          <Text style={{ textDecorationLine: "underline" }}>
            Privacy Policy
          </Text>
          .
        </Text>
      </ImageBackground>
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
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    paddingTop: 80,
  },
  headline: {
    fontSize: 21,
    textAlign: "center",
    textTransform: "capitalize",
    fontWeight: "bold",
    marginVertical: 40,
  },
  btnContainer: {
    width: "100%",
    gap: 15,
  },
  bottomLogin: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  TCText: {
    fontSize: 9,
    textAlign: "center",
  },
});
