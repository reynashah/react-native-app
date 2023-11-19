import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

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
      <TouchableOpacity
        style={{ width: 80, height: 40 }}
        onPress={handleLogout}
        className="bg-red-400 p-1 rounded-tr-2xl rounded-bl-2xl ml-4"
      >
        <Text className="text-white text-lg font-bold text-center">
          Logout
        </Text>
      </TouchableOpacity>
      <Text className="text-white font-bold text-5xl text-center mb-2">
        Home
      </Text>
      <View className="mt-1">
        <Text className="text-white font-bold text-2xl text-center ">
          Select Language:
        </Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          className="p-2 bg-gray-200 rounded-md text-sky-200"
        >
          <Picker.Item label="--Select A Language--" value=" " />
          <Picker.Item className="text-sky-200" label="English" value="en" />
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
          <Picker.Item label="--Select A Category--" value=" " />

          <Picker.Item label="Basic Vocabulary" value="B" />
          <Picker.Item label="Family Members" value="C" />
          <Picker.Item label="Food" value="D" />
          <Picker.Item label="Common Phrases" value="E" />
          <Picker.Item label="Animals" value="F" />
          <Picker.Item label="Colors" value="G" />
          <Picker.Item label="Verbs" value="H" />
          <Picker.Item label="Emotions" value="I" />
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
        onPress={() => navigation.navigate("Flashcards",{ selectedLanguage,
            selectedCategory})}
        className="py-3 bg-sky-200 mx-7  mt-7 rounded-xl"
      >
        <Text className="text-xl font-bold text-center my-1 text-gray-700">
          Begin Flashcards
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
