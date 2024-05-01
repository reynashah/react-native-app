import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("got user: ", user);
      if (user) {
        console.log("got user: ", JSON.stringify(user["email"]));
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  return { user };
}
