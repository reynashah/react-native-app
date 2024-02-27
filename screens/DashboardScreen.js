import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";


export default function DashboardScreen() {
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
      <View className="flex-1 flex justify-around my-4">
        <Text className="text-white font-bold text-4xl text-center">
          Dashboard
        </Text>
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera")}
            className="py-3 bg-sky-200 mx-7 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Camera Translator
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="py-3 bg-sky-200 mx-7 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Flashcards
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
