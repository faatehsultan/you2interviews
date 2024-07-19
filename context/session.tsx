import React, { useEffect } from "react";
import { useStorageState } from "./useStorageState";
import { router } from "expo-router";
import { User as UserType, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

const AuthContext = React.createContext<{
  signIn: (data: any) => void;
  signOut: () => void;
  session?: UserType;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: undefined,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(
  //     auth,
  //     (user) => {
  //       if (user) {
  //         setSession(JSON.stringify(user));
  //       } else {
  //         setSession(null);
  //       }
  //     },
  //     (error) => {
  //       setSession(null);
  //     }
  //   );
  // }, [auth.currentUser]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          // Perform sign-in logic here
          setSession(JSON.stringify(data));
        },
        signOut: () => {
          setSession(null);
          router.replace("/");
        },
        session: session ? (JSON.parse(session) as UserType) : undefined,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
