import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth as base_auth, db } from ".";
import { Response } from "@/types/response";
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const apiGetDynamicEnvVars = async () => {
  const collectionName = "config";
  const documentName = "env";

  const docRef = doc(db, collectionName, documentName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw Error("Could not find env vars from firebase");
  }
};

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

    await updateProfile(res?.user, { displayName: name });
    await sendEmailVerification(res?.user);

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

export const apiResetPassword = async (email: string) => {
  try {
    const res = await sendPasswordResetEmail(base_auth, email);

    return new Response(res);
  } catch (e) {
    console.log(e);
    return new Response(e, false);
  }
};

export const apiGetCurrentUser = () => {
  try {
    return new Response(base_auth.currentUser);
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
