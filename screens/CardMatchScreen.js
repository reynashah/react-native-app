import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import jsonData from "../components/words";
import shuffle from "lodash/shuffle";
import axios from "axios";

const CardMatchScreen = ({ route }) => {
    const { selectedCategory } = route.params;

    const [words, setWords] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const selectedCategoryData = jsonData.categories.find(
            (category) => category.name === selectedCategory
        );

        if (selectedCategoryData) {
            const shuffledWords = shuffle(selectedCategoryData.words).slice(0, 5);
            setWords(shuffledWords);

            translateWords(shuffledWords).then((translatedWords) => {
                setTranslations(translatedWords);
            }).catch((error) => {
                console.error("Translation error:", error);
            });
        }
    }, [selectedCategory]);

    const translateWords = async (text) => {
        const apiKey = '526bb5e251msh7aa7fa5103b1bffp155249jsnf817a86771f2'; // Replace with your API key

        const translateSingleText = async (singleText) => {
            const url = 'https://text-translator2.p.rapidapi.com/translate';

            const formData = new FormData();
            formData.append('source_language', 'en');
            formData.append('target_language', 'ru');
            formData.append('text', singleText);

            try {
                const response = await axios.post(url, formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
                    },
                });

                if (response.data && response.data.status === 'success' && response.data.data && response.data.data.translatedText) {
                    return response.data.data.translatedText;
                } else {
                    console.error('Invalid API Response:', response.data);
                    throw new Error('Invalid API response format');
                }
            } catch (error) {
                throw error;
            }
        };

        try {
            if (Array.isArray(text)) {
                return Promise.all(text.map(translateSingleText));
            } else {
                return translateSingleText(text);
            }
        } catch (error) {
            console.error("Translation error:", error);
            throw error;
        }
    };

    const handleWordPress = (word, translation) => {
        console.log("Selected Word:", word);
        console.log("Selected Translation:", translation);
        console.log("Selected Words:", selectedWords);

        if (selectedWords.length < 2 && !selectedWords.includes(word)) {
            setSelectedWords([...selectedWords, { word, translation }]);
        }

        if (selectedWords.length === 1 && !selectedWords.includes(word)) {
            console.log("Comparing translations...");
            if (selectedWords[0].translation === translation) {
                console.log("Translations match!");
                setScore(score + 1);
                setSelectedWords([]);
                removeSelectedWords(word);
            } else {
                console.log("Translations do not match!");
                setTimeout(() => {
                    setSelectedWords([]);
                }, 10000);
            }
        }
    };



    const removeSelectedWords = (word) => {
        const updatedWords = words.filter((item) => item !== word);
        setWords(updatedWords);

        const updatedTranslations = translations.filter(
            (item) => item !== word.translation
        );
        setTranslations(updatedTranslations);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            <View style={{ flex: 1 }}>
                <Text style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                    Score: {score}
                </Text>
                <FlatList
                    data={words}
                    numColumns={1}
                    keyExtractor={(item) => item}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 5,
                                backgroundColor: selectedWords.find((word) => word === item)
                                    ? 'white'
                                    : 'white',
                                height: 100,
                                length: 100,
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
                    numColumns={1}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 40,
                                backgroundColor: selectedWords.find(
                                    (word) => word.translation === item
                                )
                                    ? 'white'
                                    : 'white',
                                height: 100,
                                length: 100,
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
