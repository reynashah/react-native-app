import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import { Picker } from "@react-native-picker/picker";
import axios from "axios"; // Import axios for API requests
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const CameraResultScreen = ({ route }) => {
  const { cameraText, detectedLanguage } = route.params;
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");

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
          console.log(response.data.data.translatedText);
          return response.data.data.translatedText;
        } else {
          console.error('Invalid API Response:', response.data);
          throw new Error('Invalid API response format');
        }
      }  catch(error) {
        if (error.response) {
          console.log('Server responded with status code:', error.response.status);
          console.log('Response data:', error.response.data);
        } else if (error.request) {
          console.log('No response received:', error.request);
        } else {
          console.log('Error creating request:', error.message);
        }
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

  const translate = async () => {
    try {
      const translatedWord = await translateText(cameraText, selectedLanguage)
      console.log(translatedWord)
      setTranslatedText(translatedWord)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <View className=" flex-1 justify-around my-4">

      <TouchableOpacity
            style={{ width: 36, height: 40 }}
            onPress={() => navigation.goBack()}
            className="bg-sky-200 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        <Text className="text-white font-bold text-3xl text-center">
          Text Detected:
        </Text>
        <Text className="text-white text-lg text-center">
          {cameraText}
        </Text>

        <View className="mt-1">
          <Text className="text-white font-bold text-2xl text-center ">
            Translate Text to: {selectedLanguage}
          </Text>

          <Picker
            itemStyle={{ color: "white" }}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
            className="bg-gray-200 rounded-md text-sky-200"
          >
            <Picker.Item label="--Select Language--" value="en" />

            <Picker.Item label="Arabic" value="ar" />
            <Picker.Item label="Chinese" value="zh" />
            <Picker.Item label="English" value="en" />
            <Picker.Item label="French" value="fr" />
            <Picker.Item label="German" value="da" />
            <Picker.Item label="Greek" value="da" />
            <Picker.Item label="Gujarati" value="da" />
            <Picker.Item label="Hindi" value="hi" />
            <Picker.Item label="Japanese" value="da" />
            <Picker.Item label="Korean" value="ko" />
            <Picker.Item label="Polish" value="pl" />
            <Picker.Item label="Portuguese" value="pt" />
            <Picker.Item label="Spanish" value="es" />
            <Picker.Item label="Russian" value="ru" />

            {/* decide on language list */}
          </Picker>
          <TouchableOpacity
            onPress={translate}
            className="py-2 bg-sky-200 mx-20 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Translate
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white font-bold text-3xl text-center">
          Translated Text:
        </Text>
        <Text className="text-white text-lg text-center">
          {translatedText}
        </Text>
        <View className="space-y-4">


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
};

export default CameraResultScreen;