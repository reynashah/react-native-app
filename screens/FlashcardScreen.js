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
  const translateText = async (text) => {
    const apiKey = "1af657bb7dmsh2e461227948941bp186d8djsn58e9550d7e46";

    const translateSingleText = async (singleText) => {
      const url = "https://text-translator2.p.rapidapi.com/translate";

      const formData = new FormData();
      formData.append("source_language", "en");
      formData.append("target_language", selectedLanguage);
      formData.append("text", singleText);

      try {
        const response = await axios.post(url, formData, {
          headers: {
            "content-type": "multipart/form-data",
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
          },
        });

        console.log("API Response:", response.data);

        if (
          response.data &&
          response.data.status === "success" &&
          response.data.data &&
          response.data.data.translatedText
        ) {
          return response.data.data.translatedText;
        } else {
          console.error("Invalid API Response:", response.data);
          throw new Error("Invalid API response format");
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

    const translateFlashcards = async () => {
      if (selectedCategoryData) {
        const translatedFlashcards = await Promise.all(
          selectedCategoryData.words.map(async (word, index) => {
            const translatedWord = await translateText(word, selectedLanguage);
            return {
              id: index + 1, // Use a unique identifier (replace with a proper ID if needed)
              question: word,
              answer: translatedWord,
            };
          })
        );
        setFlashcards(translatedFlashcards);
      }
    };

    translateFlashcards();
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
