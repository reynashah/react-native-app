
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, SectionList, SafeAreaView, Modal, ScrollView } from "react-native";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebase.js';
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../theme";
import { Picker } from "@react-native-picker/picker";

const BoxPicker = ({ options, selectedValue, onValueChange }) => {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={{
                        backgroundColor: selectedValue === option.value ? '#153243' : '#f0f0f0',
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

export default function CombinedScreen() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState("");
    const [classrooms, setClassrooms] = useState([]);
    const [className, setClassName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [selectedColor, setSelectedColor] = useState('#3e588d'); // Default color

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = async () => {
            const db = getFirestore();
            const classroomCollection = collection(db, 'classrooms');
            const q = query(classroomCollection, where('owner', '==', auth.currentUser.uid));
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

    useEffect(() => {
        const unsubscribe = async () => {
            const db = getFirestore();
            const classroomCollection = collection(db, 'classrooms');
            const q = query(classroomCollection, where(`participants.${auth.currentUser.uid}`, '==', true));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClassrooms(prevState => [...prevState, ...data]);
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
        const newClassroom = {
            name: className,
            code: code,
            owner: auth.currentUser.uid, // Add owner field
            language: selectedLanguage,
            color: selectedColor // Add selected color
        };
        try {
            await addDoc(classroomCollection, newClassroom);
            setClassName('');
            setIsCreateModalVisible(false); // Close the create class modal after creating
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

                    const userRef = doc(db, 'users', { uid: currentUserUid });

                    // Check if the user is already a participant of the classroom
                    setDoc(classroomRef, { participants: { [currentUserUid]: true } }, { merge: true })
                        .then(() => {
                            alert('Joined the classroom successfully!');
                            setDoc(userRef, { classes: { [classroomId]: true } }, { merge: true });
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

    const renderItem = ({ item }) => {
        // Check if participants property exists and if the current user is a participant
       /* if (item => item.owner!== auth.currentUser.uid|| !item.participants[auth.currentUser.uid]) {
            // If the participants property is missing or the current user is not a participant, don't render the item
            return null;
        }*/

        return (
            <TouchableOpacity onPress={() => navigation.navigate("Assignment", { classData: item })}>
                <View style={{ backgroundColor: item.color, margin: 10, padding: 20, borderRadius: 10 }}>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 20 }}>Name: {item.name}</Text>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Code: {item.code}</Text>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Owner: {item.owner}</Text>
                </View>
            </TouchableOpacity>
        );
    };



    const toggleJoinModal = () => {
        setIsJoinModalVisible(!isJoinModalVisible);
    };

    const toggleCreateModal = () => {
        setIsCreateModalVisible(!isCreateModalVisible);
    };
    const myClasses = classrooms.filter(item => item.owner === auth.currentUser.uid);
    const otherClasses = classrooms.filter(item => item.owner !== auth.currentUser.uid);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <View style={styles.welcomeActivitiesContainer}>
                        <Text style={styles.welcomeText}>Welcome back, Aidai</Text>
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("MCQHome")}
                        style={[styles.button, { backgroundColor: "#284b63" }]}
                    >
                        <Text style={styles.buttonText}>Multiple Choice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("TranslateHome")}
                        style={[styles.button, { backgroundColor: "#284b63" }]}
                    >
                        <Text style={styles.buttonText}>Translate Sentences</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Home")}
                        style={[styles.button, { backgroundColor: "#284b63" }]}
                    >
                        <Text style={styles.buttonText}>Flashcards</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.classroomsContainer}>
                    <TouchableOpacity
                        onPress={() => setIsCreateModalVisible(true)}
                        style={styles.addClassButton}
                    >
                        <Text style={styles.buttonText}>Create Class</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsJoinModalVisible(true)}
                        style={styles.joinClassButton}
                    >
                        <Text style={styles.buttonText}>Join Class</Text>
                    </TouchableOpacity>
                    <SectionList
                        sections={[
                            { title: 'Classes Created by Me:', data: myClasses },
                            { title: 'Classes Created by Others', data: otherClasses },
                        ]}
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.classOwner}>{title}</Text>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>

                {/* Add more content here if needed */}
            </ScrollView>


            {/* Modal for Join Class */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isJoinModalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.classOwner}>Enter the code to join the class</Text>
                        <TextInput
                            placeholder="Enter Code"
                            value={joinCode}
                            onChangeText={setJoinCode}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                joinClassroom(joinCode); // Call the function to join the class with the entered code
                                setIsJoinModalVisible(false); // Close the modal after joining
                                setJoinCode(''); // Clear the input field after joining
                            }}
                            style={[styles.modalButton, { backgroundColor: '#153243' }]}
                        >
                            <Text style={styles.buttonText}>Join Class</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setIsJoinModalVisible(false); // Close the modal after joining
                                setJoinCode(''); // Clear the input field after joining
                            }}
                            style={[styles.modalButton, { backgroundColor: '#b4b8ab' }]}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for Create Class */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCreateModalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter the name for class</Text>
                        <TextInput
                            placeholder="Class Name"
                            value={className}
                            onChangeText={setClassName}
                            style={styles.input}
                        />
                        <BoxPicker
                            options={[
                                { label: 'Blue', value: '#3a86ff' },
                                { label: 'Yellow', value: '#ffbe0b' },
                                { label: 'Orange', value: '#fb5607' },
                                { label: 'Purple', value: '#8338ec' },
                                { label: 'Red', value: '#ff006e' },
                                {label: "Green", value: "#2DD881"}

                            ]}
                            selectedValue={selectedColor}
                            onValueChange={setSelectedColor}
                        />
                        <Text style={styles.modalTitle}>Choose the language</Text>

                        <BoxPicker
                            options={[

                                { label: 'Arabic', value: 'ar' },
                                { label: 'Chinese', value: 'zh' },
                                { label: 'French', value: 'fr' },
                                { label: 'Hindi', value: 'hi' },
                                { label: 'Korean', value: 'ko' },
                                { label: 'Polish', value: 'pl' },
                                { label: 'Portuguese', value: 'pt' },
                                { label: 'Spanish', value: 'es' },
                                { label: 'Russian', value: 'ru' }


                            ]}
                            selectedValue={selectedLanguage}
                            onValueChange={setSelectedLanguage}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                createClassroom(className);
                                setIsCreateModalVisible(false); // Close the modal after creating
                                setClassName(''); // Clear the input field after creating
                            }}
                            style={[styles.modalButton, { backgroundColor: '#153243' }]}
                        >
                            <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setIsCreateModalVisible(false); // Close the modal after creating
                                setClassName(''); // Clear the input field after creating
                            }}
                            style={[styles.modalButton, { backgroundColor: '#b4b8ab' }]}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    headerContainer: {
        alignItems: "flex-front",
        marginBottom: 20,
        backgroundColor: "#ffffff",
    },
    welcomeActivitiesContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    welcomeText: {
        fontWeight: "bold",
        color: "#000000",
        marginLeft: 10,
        fontSize:32,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
    },
    headerText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        width: 120,
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        margin: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    classroomsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#ffffff",
    },
    classOwner: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 22,
        marginTop: 25,
        marginBottom: 5,
        marginLeft: 10,


    },
    addClassButton: {
        backgroundColor: "#153243",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    joinClassButton: {
        backgroundColor: "#b4b8ab",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButton: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
});
