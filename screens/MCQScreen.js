import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import axios from "axios"; // Import axios for API requests
import jsonData from "../components/multiplechoice";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

let score = 0;
let isVisible = false;
let isVisible2 = false;

const MCQScreen = ({ route }) => {
  const { selectedLanguage, selectedCategory } = route.params;
  const [translatedText, setTranslatedText] = useState("");
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

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  const translate = async () => {
    console.log("hi");
    try {
      const translatedWord = await translateText(questions.words[currentQuestionIndex].questionText, selectedLanguage)
      console.log(translatedWord)
      setTranslatedText(translatedWord)

    } catch (error) {
      console.log(error);
    }
  };



  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = jsonData.categories.find(
    (category) => category.name === selectedCategory
  );
  translate();


  console.log("Selected Category Data:", questions);

  const handleAnswer = (selectedOptionIndex) => {
    console.log(score);
    const currentQuestion = questions.words[currentQuestionIndex];
    
    if (selectedOptionIndex === currentQuestion.correctOptionIndex) {
      score++;
      console.log(score);
      isVisible2 = false;
      isVisible = true;
    } else {
      isVisible = false;
      isVisible2 = true;
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.words.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else if (nextQuestionIndex == questions.words.length) {
      // Quiz completed
      console.log(score);
      alert(`Quiz completed! Your score is ${score}/${questions.words.length}`);
      score = 0;
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: '#ffffff' }}
    >
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-sky-200 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>
      <Text className="text-black font-bold text-4xl text-center">
        Multiple Choice
      </Text>
      <Text className="text-black text-3xl text-center my-2">
        Question {currentQuestionIndex + 1} :
      </Text>
      <View style={styles.container}>
        <Text style={styles.questionText}>
          {translatedText}
        </Text>
        {questions.words[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text className="text-zinc-50 text-md">{option}</Text>

          </TouchableOpacity>
        ))}
      </View>
      {isVisible2 && (
        <TouchableOpacity className="py-3 bg-red-500 mx-12 my-2 rounded-xl">
          <Text className="text-2xl text-center text-gray-700">Incorrect! Try Again </Text>
        </TouchableOpacity>
      )}
      {isVisible && (
        <TouchableOpacity className="py-3 bg-emerald-700 mx-12 my-2 rounded-xl">
          <Text className="text-2xl text-center text-gray-700">Correct! </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Activity")}
        className="py-3 bg-sky-200 mx-7 rounded-xl"
      >
        <Text className="text-2xl text-center text-gray-700">Complete </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 40,
    color: '#153243',
    marginBottom: 10,
    textAlign: "center",
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#153243",
    borderRadius: 5,
    width: 150,
    height:40,
    textAlign:"center"
  },
});
export default MCQScreen;
