import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth as base_auth } from ".";
import { Response } from "@/types/response";
import firestore from "@react-native-firebase/firestore";
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const apiSignupWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(
      base_auth,
      email,
      password
    );

    firestore().collection("users").doc(res?.user?.uid).set({
      name: name,
    });

    return new Response(res);
  } catch (e) {
    console.log(e);
    return new Response(e, false);
  }
};

export const apiLoginWithEmail = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(base_auth, email, password);

    return new Response(res);
  } catch (e) {
    console.log(e);
    return new Response(e, false);
  }
};

// export const apiLoginWithGoogle = async () => {
//   GoogleSignin.configure({
//     webClientId:
//       "729938612229-s531a690d74gjh3eh85ckthpdqd3stih.apps.googleusercontent.com",
//   });

//   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//   // Get the users ID token
//   const { idToken } = await GoogleSignin.signIn();

//   // Create a Google credential with the token
//   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//   // Sign-in the user with the credential
//   return auth().signInWithCredential(googleCredential);
// };
