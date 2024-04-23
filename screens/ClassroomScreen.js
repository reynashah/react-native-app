
import React, { useState, useEffect } from 'react';
import {View, TextInput, Button, FlatList, TouchableOpacity, SafeAreaView, Text, Modal} from 'react-native';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebase.js';
import {useNavigation} from "@react-navigation/native";
import AssignmentScreen from "../screens/AssignmentScreen";

import {themeColors} from "../theme";
import {Picker} from "@react-native-picker/picker"; // Assuming your Firebase initialization is in a file named 'firebase.js'

const BoxPicker = ({ options, selectedValue, onValueChange }) => {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={{
                        backgroundColor: selectedValue === option.value ? '#10B981' : '#f0f0f0',
                        padding: 10,
                        borderRadius: 5,
                        marginRight: 10,
                        marginBottom: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => onValueChange(option.value)}
                >
                    <Text style={{ color: selectedValue === option.value ? '#ffffff' : '#000000' }}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
export default function ClassroomScreen() {
    const navigation = useNavigation();
    const [classrooms, setClassrooms] = useState([]);
    const [className, setClassName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language is english



    const toggleJoinModal = () => {
        setIsJoinModalVisible(!isJoinModalVisible);
    };

    const toggleCreateModal = () => {
        setIsCreateModalVisible(!isCreateModalVisible);
    };

    useEffect(() => {
        const unsubscribe = async () => {
            const db = getFirestore();
            const classroomCollection = collection(db, 'classrooms');
            const q = query(classroomCollection);
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClassrooms(data);
        };
        unsubscribe();

        return unsubscribe;
    }, []);

    const generateUniqueCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 6;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const fetchClassrooms = async () => {
        const db = getFirestore();
        const classroomCollection = collection(db, 'classrooms');
        const q = query(classroomCollection);
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setClassrooms(data);
    };

    const createClassroom = async () => {
        const db = getFirestore();
        const classroomCollection = collection(db, 'classrooms');
        const code = generateUniqueCode();
        const newClassroom = { name: className, code: code, creator: auth.currentUser.uid,  language: selectedLanguage };
        try {
            await addDoc(classroomCollection, newClassroom);
            setClassName('');
            setIsCreateModalVisible(false); // Close the create class modal after creating
            //await joinClassroom(code);
        } catch (error) {
            console.error('Error creating classroom:', error);
        }
    };

    const joinClassroom = async (code) => {
        // Query Firestore to find the classroom with the entered code
        const db = getFirestore();
        const classroomCollection = collection(db, 'classrooms');
        const q = query(classroomCollection, where('code', '==', code));
        getDocs(q)
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    // Classroom with the entered code does not exist
                    alert('Classroom not found. Please enter a valid code.');
                } else {
                    // Classroom with the entered code exists
                    // Add the current user to the classroom
                    const classroomId = querySnapshot.docs[0].id;
                    const classroomRef = doc(db, 'classrooms', classroomId);
                    const currentUserUid = auth.currentUser.uid;

                    const userRef = doc(db, 'users', {uid: currentUserUid});


                    // Check if the user is already a participant of the classroom
                    setDoc(classroomRef, { participants: { [currentUserUid]: true } }, { merge: true })
                        .then(() => {
                            alert('Joined the classroom successfully!');

                            setDoc(userRef, {classes: {[classroomId] : true}}, {merge: true})

                            // Optionally navigate to the classroom screen or perform other actions
                        })
                        .catch((error) => {
                            console.error('Error adding user to classroom:', error);
                            alert('Failed to join the classroom. Please try again later.');
                        });
                }
            })
            .catch((error) => {
                console.error('Error joining classroom:', error);
                alert('An error occurred while joining the classroom. Please try again later.');
            });
    };
    useEffect(() => {
        fetchClassrooms();
    }, [isCreateModalVisible]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("Assignment", { classData: item })}>

        <View style={{ backgroundColor: '#ffffff', margin: 10, padding: 20, borderRadius: 10 }}>

            <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 20 }}>Name: {item.name}</Text>
            <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Code: {item.code}</Text>
            <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Owner: {item.owner}</Text>

        </View>
        </TouchableOpacity>

    );

    useEffect(() => {
        fetchClassrooms();
    }, [isCreateModalVisible]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:  themeColors.bg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 }}>
                <TouchableOpacity
                    onPress={toggleCreateModal}
                    style={{ backgroundColor: '#3e588d', padding: 10, borderRadius: 10 }}
                >
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Create Class</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={toggleJoinModal}
                    style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 10 }}
                >
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Join Class</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={classrooms}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />


            {/* Modal for Join Class */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isJoinModalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Enter the code to join the class</Text>
                        <TextInput
                            placeholder="Enter Code"
                            value={joinCode}
                            onChangeText={setJoinCode}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                joinClassroom(joinCode); // Call the function to join the class with the entered code
                                setIsJoinModalVisible(false); // Close the modal after joining
                                setJoinCode(''); // Clear the input field after joining
                            }}
                            style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 10 }}
                        >
                            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Join Class</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for Create Class */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCreateModalVisible}
                onRequestClose={createClassroom}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Enter the name for class</Text>
                        <TextInput
                            placeholder="Class Name"
                            value={className}
                            onChangeText={setClassName}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        />
                        <BoxPicker
                            options={[
                                { label: 'Spanish', value: 'es' },
                                { label: 'Russian', value: 'ru' },
                                { label:"French", value:"fr" },
                                    { label:"Spanish", value:"es" },
                                        { label: "Chinese", value:"zh" },
                                            { label:"Hindi", value:"hi" },
                                                { label:"Korean", value:"ko" }
                                // Add more languages as needed
                            ]}
                            selectedValue={selectedLanguage}
                            onValueChange={setSelectedLanguage}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                createClassroom(className);
                                toggleCreateModal(); // Close the modal after creating
                                setClassName(''); // Clear the input field after creating
                            }}
                            style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 10 }}
                        >
                            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}