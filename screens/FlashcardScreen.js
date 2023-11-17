import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import Flashcard from "../components/Flashcard";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";

export default function FlashcardScreen() {
  const navigation = useNavigation();
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      question: "Goodbye",
      answer: "Adios",
    },
    {
      id: 2,
      question: "T-Shirt",
      answer:
        "Camiseta",
    },
    {
      id: 3,
      question: "Good Morning",
      answer:
        "Buenas Dias",
    },
    {
      id: 4,
      question: "Hello",
      answer:
        "Hola",
    },
    {
      id: 5,
      question: "Pencil",
      answer:
        "Lapiz",
    },
    {
      id: 6,
      question: "Food",
      answer:
        "Comida",
    },
    
  ]);
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
          <Text className="text-white font-bold text-5xl  mb-4 text-center">
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
}
