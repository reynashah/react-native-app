import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import axios from "axios"; // Import axios for API requests
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const CameraResultScreen = ({ route }) => {
    const { selectedLanguage, cameraText } = route.params;
    const navigation = useNavigation();
    const translateText = async (text) => {
        const apiKey = '526bb5e251msh7aa7fa5103b1bffp155249jsnf817a86771f2';
    
        const translateSingleText = async (singleText) => {
          const url = 'https://text-translator2.p.rapidapi.com/translate';
    
          const formData = new FormData();
          formData.append('source_language', 'en');
          formData.append('target_language', selectedLanguage);
          formData.append('text', singleText);
    
          try {
            const response = await axios.post(url, formData, {
              headers: {
                'content-type': 'multipart/form-data',
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
              },
            });
    
            console.log('API Response:', response.data);
    
            if (response.data && response.data.status === 'success' && response.data.data && response.data.data.translatedText) {
              return response.data.data.translatedText;
            } else {
              console.error('Invalid API Response:', response.data);
              throw new Error('Invalid API response format');
            }
          } catch (error) {
            throw error;
          }
        };
    
        try {
    
          if (Array.isArray(text)) {
            // Handle an array of texts for translation
            return Promise.all(text.map(translateSingleText));
          } else {
            // Handle a single text for translation
            return translateSingleText(text);
          }
    
        } catch (error) {
          console.error("Translation error:", error);
          throw error;
        }
      };
    
    const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <View className="flex-1 flex justify-around my-4">
        <Text className="text-white font-bold text-4xl text-center">
          Text Detected:
        </Text>

        <Text className="text-white font-bold text-4xl text-center">
          Translated Text:
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
