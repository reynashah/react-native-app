import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function ActivityScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName);
    }
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <Text style={styles.headerText}>Activity</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
              onPress={() => navigation.navigate("MCQHome")}
              style={[styles.button, { backgroundColor: "#37474F" }]}
          >
            <Text style={styles.buttonText}>Multiple Choice</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => navigation.navigate("TranslateHome")}
              style={[styles.button, { backgroundColor: "#455A64" }]}
          >
            <Text style={styles.buttonText}>Translate Sentences</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={[styles.button, { backgroundColor: "#607D8B" }]}
          >
            <Text style={styles.buttonText}>Flashcards</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212121",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#81D4FA",
    marginLeft: 5,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#E0E0E0",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
