import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import Flashcard from "../components/Flashcard";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {meetOrSliceTypes as columnData} from "react-native-svg/src/lib/extract/extractViewBox";




    const FlashcardScreen = ({ route }) => {
        const { selectedLanguage, selectedCategory } = route.params;

        const navigation = useNavigation();
        const [flashcards, setFlashcards] = useState([]);
        const [words, setWords] = useState([]);


        useEffect(() => {
            const translateWord = async () => {
                try {
                    const spreadsheetId = '1McERX5s1nByAEfhE77cHjjN8gGfubll2392Vc89ruys';
                    const apiKey = 'AIzaSyDEkwJzYvpLc1j30yMsLExNNZLwVbs4Y-o';
                    const sheetName = 'Sheet1';
                    const columnLetter = 'B';
                    const sheetsApiEndpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${columnLetter}:${columnLetter}?key=${apiKey}`;

                    const response = await axios.get(sheetsApiEndpoint);
                    const columnData = response.data.values || [];
                    const wordsFromColumn = columnData.slice(1).map((row) => row[0]);


                    setWords(wordsFromColumn);








                    // Continue with translation and other logic...
                        /* DO NOT DELETE
                        works, but API has a small limit
                        uncomment when presenting only*/


                    const encodedParams = new URLSearchParams();
                    encodedParams.set('source', 'en');
                    encodedParams.set('target', selectedLanguage);
                    encodedParams.set('q', 'hi');

                        const translationOptions = {
                            method: 'POST',
                            url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept-Encoding': 'application/gzip',
                                'X-RapidAPI-Key': 'd91ce7b3f7msh313280bd0d06458p152029jsn550691186239',
                                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                            },
                            data: encodedParams,
                        };

                        const translationResponse = await axios.request(translationOptions);
                        const translatedWord = translationResponse.data.data.translations[0].translatedText;



                    const flashcardData = wordsFromColumn.map((word, index) => ({
                        id: index + 1,
                        question: word,
                        answer: translatedWord,
                    }));

                    setFlashcards(flashcardData);

                } catch (error) {
                    console.error(error);
                }
            };

            translateWord();
        }, []);

    return (
        <SafeAreaView
            className="flex-1"
            style={{backgroundColor: themeColors.bg}}
        >
            <View className="flex-1 flex my-2">
                <View className="flex-row justify-start">
                    <TouchableOpacity
                        style={{width: 36, height: 40}}

                        onPress={() => navigation.goBack()}
                        className="bg-sky-200 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
                    >
                        <ArrowLeftIcon size="20" color="black"/>
                    </TouchableOpacity>
                    <View className="flex-row justify-center mt-5">
                        <Text className="text-white font-bold text-5xl  mb-4 text-center">
                            {"   "}Flashcards{" "}
                        </Text>
                        <Image
                            source={require("../assets/images/lightbulb.png")}
                            style={{width: 42, height: 42}}
                        />
                    </View>
                </View>

                <View className="flex-row justify-start">
                    <FlatList
                        numColumns={2}
                        data={flashcards}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => <Flashcard flashcard={item}/>}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default FlashcardScreen;
