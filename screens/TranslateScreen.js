import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Flashcard from "../components/Flashcard";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import axios from "axios"; // Import axios for API requests
import jsonData from "../components/sentences";
import queryString from "query-string";

let userScore = 0;
let translateCount = 0;
let isVisible = false;

const TranslateScreen = ({ route }) => {
  const { selectedLanguage, selectedCategory } = route.params;
  const navigation = useNavigation();
  const textInputRef = useRef(null);
  const [translatedQuestion, setTranslatedQuestion] = useState("");
  const [questionNum, setQuestionNum] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
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

  const translate = async () => {
    console.log("hi");
    if(translateCount < 2){
      translateCount++;
    try {
      const translatedWord = await translateText(
        selectedCategoryData.words[questionNum],
        selectedLanguage
      );
      console.log(translatedWord);
      setTranslatedQuestion(translatedWord);
    } catch (error) {
      console.log(error);
    }
  }
  };

  const removeCorrect = async () => {
    console.log("hi");
    isVisible = false;
  };

  // Find the selected category in the JSON data
  const selectedCategoryData = jsonData.categories.find(
    (category) => category.name === selectedCategory
  );

  translate();

  // Initialize flashcards state with translated words
  const [flashcards, setFlashcards] = useState([""]);
  console.log("Selected Category Data:", selectedCategoryData);

  function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create a 2D array to store the distances
    const distances = [];
    for (let i = 0; i <= len1; i++) {
        distances[i] = [];
        distances[i][0] = i;
    }
    for (let j = 0; j <= len2; j++) {
        distances[0][j] = j;
    }

    // Compute the distances
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            distances[i][j] = Math.min(
                distances[i - 1][j] + 1,
                distances[i][j - 1] + 1,
                distances[i - 1][j - 1] + cost
            );
        }
    }

    // Return the Levenshtein distance
    return distances[len1][len2];
}

function areSimilar(str1, str2, threshold) {
    const distance = levenshteinDistance(str1, str2);
    return distance <= threshold;
}

  function nextQuestion() {
    translateCount = 0;
    console.log("user answer: " + userAnswer);
    console.log("expected answer: " + selectedCategoryData.words[questionNum]);

  const string1 = userAnswer.toString();
  const string2 = selectedCategoryData.words[questionNum].toString();
  const threshold = 2; 
  //  adjust the threshold as per requirement

if (areSimilar(string1, string2, threshold)) {
    console.log("The strings are similar.");
} else {
    console.log("The strings are not similar.");
}

    if (areSimilar(string1, string2, threshold)) {
      isVisible = true;
      setQuestionNum(questionNum + 1);
      console.log(questionNum);
      userScore++;
      console.log("score: " + userScore);

      if (textInputRef.current) {
        textInputRef.current.clear();
      }
    } else {
      alert(`Incorrect! Try Again`);
    }

    if (questionNum > 3) {
      alert(
        `Quiz completed! Your score is ${questionNum + 1}/${questionNum + 1}`
      );
    }
  }

  function skipQuestion() {
    translateCount = 0;
    setQuestionNum(questionNum + 1);
    console.log(questionNum);

    if (textInputRef.current) {
      textInputRef.current.clear();
    }

    if (questionNum > 3) {
      alert(
        `Quiz completed! Your score is ${questionNum + 1}/${questionNum + 1}`
      );
    }
  }

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
              {"     "} Activity{" "}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-center">
          {/* <Text className="text-white text-center font-bold text-2xl mx-3">
            Translate: {selectedCategoryData.words[questionNum]}
          </Text> */}
          <Text className="text-white text-center font-bold text-2xl mx-3">
            Translate: {translatedQuestion}
          </Text>
        </View>
        <View className="flex-row justify-center">
          <TextInput
            ref={textInputRef}
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl my-6"
            placeholder="type here"
            value={userAnswer}
            onChangeText={(value) => setUserAnswer(value) && removeCorrect}
          />
                {isVisible && (
        <TouchableOpacity className="py-3 bg-emerald-500 mx-12 my-2 rounded-xl">
          <Text className="text-2xl text-center text-gray-700">Correct! </Text>
        </TouchableOpacity>
      )}
        </View>
        <TouchableOpacity
          onPress={nextQuestion}
          className="justify-bottom py-3 bg-sky-200 mx-7 mt-80 rounded-xl"
        >
          <Text className="text-4xl text-center text-gray-700">Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={skipQuestion}
          className="justify-bottom py-2 bg-sky-200 mx-7 mt-4 rounded-xl"
        >
          <Text className="text-2xl text-center text-gray-700">Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TranslateScreen;
