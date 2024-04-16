import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import jsonData from "../components/words";
import shuffle from "lodash/shuffle"; // Import lodash shuffle for shuffling words

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

  const translateWords = async (words) => {
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const apiUrl = 'https://api.cognitive.microsofttranslator.com/translate';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': apiKey,
          'Ocp-Apim-Subscription-Region': 'YOUR_REGION', // Replace with your region
        },
        body: JSON.stringify({
          texts: words.map((word) => ({ text: word })),
          from: 'en',
          to: selectedLanguage,
        }),
      });

      const data = await response.json();
      const translatedWords = data.map((item) => item.translations[0].text);
      setTranslations(translatedWords);
    } catch (error) {
      console.error('Translation error:', error);
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
          <Text style={{ alignSelf: 'flex-end', marginRight: 10 }}>
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 5,
                        backgroundColor: selectedWords.find((word) => word === item)
                            ? 'gray'
                            : 'lightgray',
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 5,
                        backgroundColor: selectedWords.find(
                            (word) => word.translation === item
                        )
                            ? 'gray'
                            : 'lightgray',
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
