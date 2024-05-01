import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <TouchableOpacity
        style={{ width: 80, height: 40 }}
        onPress={handleLogout}
        className="bg-red-400 p-1 rounded-tr-2xl rounded-bl-2xl ml-4"
      >
        <Text className="text-white text-lg font-bold text-center">Logout</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>R</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{auth.currentUser.tenantId}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>{auth.currentUser.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoText}>Your Location</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Bio:</Text>
            <Text style={styles.infoText}>Your bio goes here</Text>
          </View>
          {/* <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Portfolio:</Text>
          <Text style={styles.infoText}>https://yourportfolio.com</Text>
        </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.16,
  },
  avatar: {
    fontSize: 72,
    fontWeight: "700",
  },
  nameContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  name: {
    fontSize: 28,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  infoLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666666",
    marginRight: 8,
  },
  infoText: {
    fontSize: 20,
  },
});
