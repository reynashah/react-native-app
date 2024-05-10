// CameraResultScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    Modal,
    ScrollView,
} from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const CameraResultScreen = ({ route }) => {
    // Destructuring parameters from navigation route
    const { cameraText } = route.params;

    // State for selected language and translated text
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [translatedText, setTranslatedText] = useState("");

    // State for modal visibility
    const [modalVisible, setModalVisible] = useState(false);
    const [translationModalVisible, setTranslationModalVisible] = useState(false);

    // Navigation instance for navigating between screens
    const navigation = useNavigation();

    // Function to translate text
    const translateText = async (text) => {
        // API Key for translation service
        const apiKey = "1af657bb7dmsh2e461227948941bp186d8djsn58e9550d7e46";

        // URL of the translation API
        const url = "https://text-translator2.p.rapidapi.com/translate";

        // Creating form data for API request
        const formData = new FormData();
        formData.append("source_language", "en");
        formData.append("target_language", selectedLanguage);
        formData.append("text", text);

        try {
            // Sending POST request to translation API
            const response = await axios.post(url, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
                },
            });

            // Logging API response
            console.log("API Response:", response.data);

            // Checking if response is successful
            if (
                response.data &&
                response.data.status === "success" &&
                response.data.data &&
                response.data.data.translatedText
            ) {
                // Setting translated text to state
                setTranslatedText(response.data.data.translatedText);
                setTranslationModalVisible(true); // Open translation modal
                return response.data.data.translatedText;
            } else {
                console.error("Invalid API Response:", response.data);
                throw new Error("Invalid API response format");
            }
        } catch (error) {
            // Handling API request error
            console.error("Translation Error:", error);
            throw error;
        }
    };

    // Function to handle translation process
    const translate = async () => {
        try {
            // Call translateText function with cameraText and selectedLanguage
            const translatedWord = await translateText(cameraText);
            // Logging translated word
            console.log(translatedWord);
            // Setting translated word to state
            setTranslatedText(translatedWord);
        } catch (error) {
            // Handling translation error
            console.log(error);
        }
    };

    return (
        // Container for the screen content
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            {/* Main content view */}
            <View style={{ flex: 1, justifyContent: "center" }}>
                {/* Button to navigate back */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", top: 20, left: 20 }}
                >
                    <ArrowLeftIcon size={24} color="black" />
                </TouchableOpacity>
                {/* Text showing detected text */}
                <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>
                    Text Detected:
                </Text>
                <Text style={{ textAlign: "center", fontSize: 18 }}>{cameraText}</Text>

                {/* Button to select translation language */}
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: "skyblue",
                        paddingVertical: 10,
                        marginHorizontal: 20,
                        borderRadius: 10,
                        marginTop: 20,
                    }}
                >
                    <Text style={{ textAlign: "center", fontSize: 18 }}>
                        Translate Text to: {selectedLanguage || "--Select Language--"}
                    </Text>
                </TouchableOpacity>

                {/* Button to trigger translation */}
                <TouchableOpacity
                    onPress={translate}
                    style={{
                        backgroundColor: "skyblue",
                        paddingVertical: 10,
                        marginHorizontal: 20,
                        borderRadius: 10,
                        marginTop: 20,
                    }}
                >
                    <Text style={{ textAlign: "center", fontSize: 18 }}>Translate</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for language selection */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {/* Modal content */}
                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 10,
                                width: 300,
                            }}
                        >
                            {/* Text for language selection */}
                            <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 20 }}>
                                Select Language:
                            </Text>
                            {/* Picker for selecting language */}
                            <Picker
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                                style={{ backgroundColor: "#f0f0f0", borderRadius: 10 }}
                            >
                                {/* Placeholder item */}
                                <Picker.Item label="--Select Language--" value="" />
                                {/* Language options */}
                                <Picker.Item label="Arabic" value="ar" />
                                <Picker.Item label="Chinese" value="zh" />
                                <Picker.Item label="English" value="en" />
                                <Picker.Item label="French" value="fr" />
                                <Picker.Item label="German" value="da" />
                                <Picker.Item label="Greek" value="da" />
                                <Picker.Item label="Gujarati" value="da" />
                                <Picker.Item label="Hindi" value="hi" />
                                <Picker.Item label="Japanese" value="da" />
                                <Picker.Item label="Korean" value="ko" />
                                <Picker.Item label="Polish" value="pl" />
                                <Picker.Item label="Portuguese" value="pt" />
                                <Picker.Item label="Spanish" value="es" />
                                <Picker.Item label="Russian" value="ru" />


                                {/* Add more languages */}
                            </Picker>
                            {/* Confirm button */}
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{
                                    backgroundColor: "skyblue",
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    marginTop: 20,
                                }}
                            >
                                <Text style={{ textAlign: "center", fontSize: 18 }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Modal for displaying translated text */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={translationModalVisible}
                onRequestClose={() => setTranslationModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {/* Modal content */}
                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 10,
                                width: 400,
                                maxHeight: 1500,
                            }}
                        >
                            {/* Text for translated text */}
                            <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 20 }}>
                                Translated Text:
                            </Text>
                            <ScrollView>
                                <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 20 }}>
                                    {translatedText}
                                </Text>
                            </ScrollView>
                            {/* Close button */}
                            <TouchableOpacity
                                onPress={() => setTranslationModalVisible(false)}
                                style={{
                                    backgroundColor: "skyblue",
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ textAlign: "center", fontSize: 18 }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default CameraResultScreen;
