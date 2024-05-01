import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

export default function MCQScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const questions = [
    {
      questionText: "La mesa",
      options: ["chair", "table", "sofa", "school"],
      correctOptionIndex: 2,
    },
    {
      questionText: "El champiñón",
      options: ["cucumber", "tomato", "mushroom", "pepper"],
      correctOptionIndex: 2,
    },
    {
      questionText: "La escuela",
      options: ["room", "house", "school", "book"],
      correctOptionIndex: 2,
    },
    {
      "questionText": "El perro",
      "options": ["dog", "cat", "horse", "bird"],
      "correctOptionIndex": 0
    },
    {
      "questionText": "El libro",
      "options": ["book", "pen", "desk", "lamp"],
      "correctOptionIndex": 0
    },
    {
      "questionText": "La ventana",
      "options": ["door", "window", "wall", "roof"],
      "correctOptionIndex": 1
    },
    {
      "questionText": "El árbol",
      "options": ["flower", "tree", "river", "mountain"],
      "correctOptionIndex": 1
    }
  ];

  const handleAnswer = (selectedOptionIndex) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOptionIndex === currentQuestion.correctOptionIndex) {
      setScore(score + 1);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Quiz completed
      alert(`Quiz completed! Your score is ${score}/${questions.length}`);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-sky-200 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>
      <Text className="text-white font-bold text-4xl text-center">
        Multiple Choice
      </Text>
      <View style={styles.container}>
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex].questionText}
        </Text>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("MCQ")}
        className="py-3 bg-sky-200 mx-7 rounded-xl"
      >
        <Text className="text-2xl text-center text-gray-700">Next </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 30,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#c9caf2",
    borderRadius: 5,
  },
});
