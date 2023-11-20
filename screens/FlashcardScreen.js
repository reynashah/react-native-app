import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import Flashcard from "../components/Flashcard";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import axios from "axios"; // Import axios for API requests
import jsonData from "../components/words";
import queryString from "query-string";

const FlashcardScreen = ({ route }) => {
  const { selectedLanguage, selectedCategory } = route.params;
  const navigation = useNavigation();

  const translateText = async (text, targetLanguage) => {
    try {
      const params = {
        q: text,
        target: targetLanguage,
        source: "en",
      };

      const url =
        "https://google-translate1.p.rapidapi.com/language/translate/v2?" +
        queryString.stringify(params);

      const options = {
        method: "POST",
        url,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "Accept-Encoding": "application/gzip",
          "X-RapidAPI-Key":
            "38ea9d64acmshde920b4a986cd9cp145759jsnf3fe7545575e",
          "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
        },
      };

      const response = await axios(options);
      console.log("API Response:", response);
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  };

  // Find the selected category in the JSON data
  const selectedCategoryData = jsonData.categories.find(
    (category) => category.name === selectedCategory
  );

  // Initialize flashcards state with translated words
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
    console.log("JSON Data:", jsonData);
    console.log(selectedCategory);
    console.log("Selected Category Data:", selectedCategoryData);

    if (selectedCategoryData) {
      const translatedFlashcards = selectedCategoryData.words.map(
        (word, index) => ({
          id: index + 1, // Use a unique identifier (replace with a proper ID if needed)
          question: word,
          answer: translateText(word, selectedLanguage),
        })
      );
      setFlashcards(translatedFlashcards);
    }
  }, [selectedCategoryData, selectedLanguage]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <View className="flex-1 flex my-2">
        <View className="flex-row justify-start">
          <TouchableOpacity
            style={{ width: 36, height: 40 }}
            onPress={() => navigation.goBack()}
            className="bg-sky-200 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
          <View className="flex-row justify-center mt-5">
            <Text className="text-white font-bold text-5xl mb-4 text-center">
              {"   "}Flashcards{" "}
            </Text>
            <Image
              source={require("../assets/images/lightbulb.png")}
              style={{ width: 42, height: 42 }}
            />
          </View>
        </View>

        <View className="flex-row justify-start">
          <FlatList
            numColumns={2}
            data={flashcards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Flashcard flashcard={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FlashcardScreen;
