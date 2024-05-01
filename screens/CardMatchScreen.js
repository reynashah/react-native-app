import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import jsonData from "../components/words";
import shuffle from "lodash/shuffle";
import axios from "axios"; // Import lodash shuffle for shuffling words

const CardMatchScreen = ({ route }) => {
    const { selectedLanguage, selectedCategory } = route.params;

    const [words, setWords] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const selectedCategoryData = jsonData.categories.find(
            (category) => category.name === selectedCategory
        );

        if (selectedCategoryData) {
            // Shuffle the words and select the first 5
            const shuffledWords = shuffle(selectedCategoryData.words).slice(0, 5);
            setWords(shuffledWords);

            // Translate the selected words
            translateWords(shuffledWords);
        }
    }, [selectedCategory, selectedLanguage]);

    const translateWords = async (text) => {
        const apiKey = "526bb5e251msh7aa7fa5103b1bffp155249jsnf817a86771f2";

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

    const handleWordPress = (word, translation) => {
        if (selectedWords.length < 2 && !selectedWords.includes(word)) {
            setSelectedWords([...selectedWords, { word, translation }]);
        }

        if (selectedWords.length === 1 && !selectedWords.includes(word)) {
            // Check if translations match
            if (selectedWords[0].translation === translation) {
                setScore(score + 1);
                setSelectedWords([]);
                removeSelectedWords(word);
            } else {
                setTimeout(() => {
                    setSelectedWords([]);
                }, 1000);
            }
        }
    };

    const removeSelectedWords = (word) => {
        const updatedWords = words.filter((item) => item !== word);
        setWords(updatedWords);

        const updatedTranslations = translations.filter(
            (item) => item.word !== word.translation
        );
        setTranslations(updatedTranslations);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            <View style={{ flex: 1 }}>
                <Text style={{ alignSelf: "flex-end", marginRight: 10 }}>
                    Score: {score}
                </Text>
                <FlatList
                    data={words}
                    numColumns={5}
                    keyExtractor={(item) => item}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                margin: 5,
                                backgroundColor: selectedWords.find((word) => word === item)
                                    ? "gray"
                                    : "lightgray",
                                height: 50,
                                borderRadius: 5,
                            }}
                            onPress={() => handleWordPress(item, translations[index])}
                        >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
                <FlatList
                    data={translations}
                    numColumns={5}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                margin: 5,
                                backgroundColor: selectedWords.find(
                                    (word) => word.translation === item
                                )
                                    ? "gray"
                                    : "lightgray",
                                height: 50,
                                borderRadius: 5,
                            }}
                            onPress={() => handleWordPress(item.translation, item.word)}
                        >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default CardMatchScreen;