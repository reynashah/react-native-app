
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import jsonData from "../components/words";
import shuffle from "lodash/shuffle";
import axios from "axios";

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

        if (selectedCategoryData && selectedCategoryData.translations) {
            const shuffledWords = shuffle(selectedCategoryData.words).slice(0, 5);
            const shuffledTranslations = shuffle(selectedCategoryData.translations).slice(0, 5);

            setWords(shuffledWords);
            setTranslations(shuffledTranslations);
        }
    }, [selectedCategory, selectedLanguage]);


    const handleWordPress = (word, translation, index) => {
        if (selectedWords.length === 2) {
            return;
        }

        const existingWord = selectedWords.find((selected) => selected.index === index);
        if (existingWord) {
            setSelectedWords(selectedWords.filter((selected) => selected.index !== index));
            return;
        }

        setSelectedWords([...selectedWords, { word, translation, index }]);

        if (selectedWords.length === 1) {
            const [firstSelectedWord] = selectedWords;
            if (firstSelectedWord.translation === translation && firstSelectedWord.word === word) {
                setScore(score + 1);
                setTimeout(() => {
                    setSelectedWords([]);
                    setWords(words.filter((_, idx) => idx !== firstSelectedWord.index));
                    setTranslations(translations.filter((_, idx) => idx !== index));
                }, 1000);
            } else {
                setTimeout(() => {
                    setSelectedWords([]);
                }, 1000);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff'}}>
            <View style={{ flex: 1 }}>
                <Text style={{ alignSelf: "flex-end", marginRight: 10 }}>Score: {score}</Text>
                <FlatList
                    data={words}
                    numRows={5}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                margin: 5,
                                backgroundColor: selectedWords.find((word) => word.index === index)
                                    ? "gray"
                                    : "lightgray",
                                height: 50,
                                borderRadius: 5,
                            }}
                            onPress={() => handleWordPress(item, translations[index], index)}
                        >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
                <FlatList
                    data={translations}
                    numRows={5}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                margin: 5,
                                backgroundColor: selectedWords.find((word) => word.index === index)
                                    ? "gray"
                                    : "lightgray",
                                height: 50,
                                borderRadius: 5,
                            }}
                            onPress={() => handleWordPress(words[index], item, index)}
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
