import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Header } from "react-native-elements";
import Flashcard from "./Flashcard";

export default function FlashcardScreen() {
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      question: "What is React?",
      answer: "A JavaScript library for building user interfaces",
    },
    {
      id: 2,
      question: "What is React Native?",
      answer:
        "A framework that allows you to create native mobile applications using JavaScript and React",
    },
    {
      id: 3,
      question: "What is Expo?",
      answer:
        "A tool that simplifies the development process of React Native apps by providing a set of pre-built features and services",
    },
  ]);
  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: "Flashcard App",
          style: { color: "#fff", fontSize: 20 },
        }}
        backgroundColor="#3D6DCC"
      />
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Flashcard flashcard={item} />}
      />
    </View>
  );
}
