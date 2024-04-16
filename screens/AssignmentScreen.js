import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, DatePickerIOS, Platform, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getFirestore, collection, addDoc, query, where, getDocs, doc } from 'firebase/firestore';

const AssignmentScreen = ({ route }) => {
    const { classData } = route.params;
    const classId = classData.id;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            const db = getFirestore();
            const assignmentCollection = collection(db, 'assignments');
            const q = query(assignmentCollection, where('classId', '==', classId));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAssignments(data);
        };
        fetchAssignments();
    }, [classId]);

    const handleAddAssignment = () => {
        setModalVisible(true);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date.dateString);
    };

    const handleSubmitAssignment = async () => {
        const db = getFirestore();
        const assignmentCollection = collection(db, 'assignments');
        const newAssignment = { classId, dueDate: selectedDate };
        try {
            await addDoc(assignmentCollection, newAssignment);
            setModalVisible(false);
            setSelectedDate(null);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Calendar onDayPress={handleDateSelect} />
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 10 }} onPress={handleAddAssignment}>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Add Assignment</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 20, marginBottom: 10 }}>Enter the Due Date:</Text>
                        {Platform.OS === 'ios' ? (
                            <DatePickerIOS
                                date={selectedDate ? new Date(selectedDate) : new Date()}
                                onDateChange={(date) => setSelectedDate(date.toISOString().split('T')[0])}
                                mode="date"
                            />
                        ) : (
                            <Text>Custom Date Picker for Android</Text>
                        )}
                        <Button title="Submit" onPress={handleSubmitAssignment} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AssignmentScreen;


