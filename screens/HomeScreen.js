import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function HomeScreen() {
    const handleLogout = async ()=>{
        await signOut(auth);
    }
  return (
    <SafeAreaView className="flex-1 flex-row justify-center items-center">
      <Text className=" text-lg">Home Page</Text>
      <TouchableOpacity onPress={handleLogout} className="p-1 bg-red-400 rounded-lg">
        <Text className="text-white text-lg font-bold">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

// LanguageCategorySelection.js
import React, { useState } from 'react';
import { View, Text, Picker } from 'react-native';
import tailwind from 'tailwind-rn';

const LanguageCategorySelection = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <View style={tailwind('flex-1 justify-center items-center')}>
            <View style={tailwind('p-4')}>
                <Text style={tailwind('text-lg font-bold')}>Select Language:</Text>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue) => handleLanguageChange(itemValue)}
                    style={tailwind('p-2 bg-gray-200 rounded-md')}
                >
                    <Picker.Item label="English" value="en" />
                    <Picker.Item label="Spanish" value="es" />
                    {/* decide on language list */}



                </Picker>
            </View>

            <View style={tailwind('p-4')}>
                <Text style={tailwind('text-lg font-bold')}>Select Category:</Text>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => handleCategoryChange(itemValue)}
                    style={tailwind('p-2 bg-gray-200 rounded-md')}
                >
                    {/* Add category options */}
                    <Picker.Item label="Basic Vocabulary" value="basic" />
                    <Picker.Item label="Family Members" value="family" />
                    <Picker.Item label="Food" value="food" />
                    <Picker.Item label="Common Phrases" value="phrases" />
                    <Picker.Item label="Animals" value="animals" />
                    <Picker.Item label="Colors" value="colors" />
                    <Picker.Item label="Verbs" value="verbs" />
                    <Picker.Item label="Emotions" value="emotions" />
                </Picker>
            </View>

            <View style={tailwind('mt-8')}>
                <Text style={tailwind('text-lg font-bold')}>
                    Selected Language: {selectedLanguage}
                </Text>
                <Text style={tailwind('text-lg font-bold')}>
                    Selected Category: {selectedCategory}
                </Text>
            </View>
        </View>
    );
};

export default LanguageCategorySelection;
