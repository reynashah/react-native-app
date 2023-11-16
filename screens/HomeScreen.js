import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <Text className="text-white font-bold text-4xl text-center p-4">
        Home
      </Text>
      <View className="p-4">
        <Text className="text-white font-bold text-2xl text-center ">
          Select Language:
        </Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          className="p-2 bg-gray-200 rounded-md text-sky-200"
        >
          <Picker.Item
            className="text-sky-200"
            label="English"
            value="en"
          />
          <Picker.Item label="Spanish" value="es" />
          {/* decide on language list */}
        </Picker>
      </View>

      <View className="p-4">
        <Text className="text-white font-bold text-2xl text-center ">
          Select Language:
        </Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          className="p-2 bg-gray-200 rounded-md"
        >
          <Picker.Item label="Basic Vocabulary" value="basic" />
          <Picker.Item label="Family Members" value="family" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Common Phrases" value="phrases" />
          <Picker.Item label="Animals" value="animals" />
          <Picker.Item label="Colors" value="colors" />
          <Picker.Item label="Verbs" value="verbs" />
          <Picker.Item label="Emotions" value="emotions" />
        </Picker>
      </View>

      <View className="mt-8">
        <Text className="text-white font-bold text-2xl text-center ">
          Selected Language: {selectedLanguage}
        </Text>
        <Text className="text-white font-bold text-2xl text-center ">
          Selected Category: {selectedCategory}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-400 rounded-lg"
      >
        <Text className="text-white text-lg font-bold text-center">
          {" "}
          Logout{" "}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
