import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {themeColors} from "../theme";
import { Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';



const DashboardScreen = () => {
    const navigation = useNavigation();

    const navigateToHome = () => {
        navigation.navigate('Home'); // Navigate to the 'Home' screen
    };

    const [className, setClassName] = useState('');
    const [classCode, setClassCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [joinedClassrooms, setJoinedClassrooms] = useState([]);

    useEffect(() => {
        loadJoinedClassrooms();
    }, []);

    const loadJoinedClassrooms = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('classrooms');
            if (jsonValue !== null) {
                setJoinedClassrooms(JSON.parse(jsonValue));
            }
        } catch (error) {
            console.error('Error loading joined classrooms:', error.message);
        }
    };

    const saveJoinedClassrooms = async (classrooms) => {
        try {
            const jsonValue = JSON.stringify(classrooms);
            await AsyncStorage.setItem('classrooms', jsonValue);
        } catch (error) {
            console.error('Error saving joined classrooms:', error.message);
        }
    };

    const generateClassCode = () => {
        return Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit code
    };

    const createClassroom = () => {
        if (!className.trim()) {
            setErrorMessage('Please enter a class name.');
            return;
        }

        const newClassroom = { className, classCode: generateClassCode() }; // Generate and assign a 5-digit code
        const updatedClassrooms = [...joinedClassrooms, newClassroom];
        setJoinedClassrooms(updatedClassrooms);
        saveJoinedClassrooms(updatedClassrooms);

        setClassName(''); // Clear input after successful creation
        setErrorMessage(''); // Clear any previous error messages
    };

    const joinClassroom = () => {
        if (!classCode.trim()) {
            setErrorMessage('Please enter a class code.');
            return;
        }

        const existingClassroom = joinedClassrooms.find(item => item.classCode == classCode);
        if (existingClassroom) {
            setClassCode('');
            setErrorMessage('');
            Alert.alert('Success', 'You have successfully joined the classroom.');
        } else {
            setErrorMessage('Classroom does not exist.');
        }
    };
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
          <View style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
              <Button title="Go to Home" onPress={navigateToHome} />
          </View>
        <TouchableOpacity
            style={{ width: 100, height: 40, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 10, margin: 10 }}
            //onPress={handleLogout}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Logout</Text>
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Dashboard</Text>

        <View style={{ marginTop: 20 }}>
          <TextInput
              style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
              placeholder="Enter Class Name"
              value={className}
              onChangeText={setClassName}
          />

          <Button
              title="Create Class"
              style={{ backgroundColor: 'blue', marginHorizontal: 20, borderRadius: 10 }}
              onPress={createClassroom}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TextInput
              style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
              placeholder="Enter Class Code"
              value={classCode}
              onChangeText={setClassCode}
          />

          <Button
              title="Join Class"
              style={{ backgroundColor: 'green', marginHorizontal: 20, borderRadius: 10 }}
              onPress={joinClassroom}
          />
        </View>

        {errorMessage ? <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorMessage}</Text> : null}

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Joined Classrooms</Text>
            <FlatList
                data={joinedClassrooms}
                renderItem={({ item }) => (
                    <View>
                        <Text style={{ fontSize: 16 }}>{item.className}</Text>
                        <Text style={{ fontSize: 16 }}>Code: {item.classCode}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
      </SafeAreaView>
  );

}
export default DashboardScreen;
