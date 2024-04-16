import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TouchableOpacity, Modal, TextInput, SafeAreaView} from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import {themeColors} from "../theme";

const AssignmentScreen = () => {
    const navigation = useNavigation();
    const [assignments, setAssignments] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [assignmentName, setAssignmentName] = useState('');

    // Fetch assignments from Firestore
    useEffect(() => {
        const fetchAssignments = async () => {
            const db = getFirestore();
            const assignmentCollection = collection(db, 'assignments');
            const querySnapshot = await getDocs(assignmentCollection);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAssignments(data);
        };
        fetchAssignments();
    }, []);

    // Function to add an assignment
    const addAssignment = async () => {
        const db = getFirestore();
        const assignmentCollection = collection(db, 'assignments');
        const newAssignment = {
            topic: selectedTopic,
            dueDate: dueDate,
            dueTime: dueTime,
            name: assignmentName,
        };
        try {
            await addDoc(assignmentCollection, newAssignment);
            setIsAddModalVisible(false); // Close the modal after adding assignment
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    // Render each assignment item
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const db = getFirestore();
                const assignmentCollection = collection(db, 'assignments');
                const querySnapshot = await getDocs(assignmentCollection);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAssignments(data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };
        fetchAssignments();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("AssignmentDetails", { assignmentId: item.id })}>
            <View style={{ backgroundColor: '#ffffff', margin: 10, padding: 20, borderRadius: 10 }}>
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 20 }}>Name: {item.name}</Text>
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Due Date: {item.dueDate}</Text>
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Topic: {item.topic}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 }}>
                <TouchableOpacity onPress={() => setIsAddModalVisible(true)} style={{ backgroundColor: '#3e588d', padding: 10, borderRadius: 10 }}>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Add Assignment</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={assignments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Add Assignment</Text>
                        <Text style={{ marginBottom: 5 }}>Assignment Name:</Text>
                        <TextInput
                            placeholder="Enter Assignment Name"
                            value={assignmentName}
                            onChangeText={setAssignmentName}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        />
                        <Text style={{ marginBottom: 5 }}>Due Date (YYYY-MM-DD):</Text>
                        <TextInput
                            placeholder="Enter Due Date"
                            value={dueDate}
                            onChangeText={setDueDate}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        />
                        <Text style={{ marginBottom: 5 }}>Due Time (HH:MM AM/PM):</Text>
                        <TextInput
                            placeholder="Enter Due Time"
                            value={dueTime}
                            onChangeText={setDueTime}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        />
                        <Text style={{ marginBottom: 5 }}>Select A Category:</Text>
                        <Picker
                            selectedValue={selectedTopic}
                            onValueChange={itemValue => setSelectedTopic(itemValue)}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        >
                            <Picker.Item label="--Select A Category--" value="" />
                            <Picker.Item label="Basic Vocabulary" value="Basic" />
                            <Picker.Item label="Family Members" value="Family" />
                            <Picker.Item label="Food" value="Food" />
                            <Picker.Item label="Common Phrases" value="Phrases" />
                            <Picker.Item label="Animals" value="Animals" />
                            <Picker.Item label="Colors" value="Colors" />
                            <Picker.Item label="Verbs" value="Verbs" />
                            <Picker.Item label="Emotions" value="Emotions" />
                        </Picker>
                        <Button title="Add" onPress={addAssignment} />
                        <Button title="Cancel" onPress={() => setIsAddModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AssignmentScreen;

