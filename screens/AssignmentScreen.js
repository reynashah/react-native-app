import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Modal, SafeAreaView, TextInput } from 'react-native';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from "../theme";
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../config/firebase.js';

const BoxPicker = ({ options, selectedValue, onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectItem(item.value)}>
            <View style={{ padding: 10 }}>
                <Text>{item.label}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleSelectItem = (value) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}>
                <Text>{options.find(option => option.value === selectedValue)?.label || 'Select'}</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, width: '80%' }}>
                        <FlatList
                            data={options}
                            renderItem={renderItem}
                            keyExtractor={item => item.value}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const AssignmentScreen = ({ route }) => {
    const navigation = useNavigation();
    const { classData } = route.params;
    const [assignments, setAssignments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isAddAssignmentModalVisible, setIsAddAssignmentModalVisible] = useState(false);
    const [isAddPostModalVisible, setIsAddPostModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [dueDateTime, setDueDateTime] = useState(new Date());
    const [assignmentName, setAssignmentName] = useState('');
    const [postContent, setPostContent] = useState('');

    const isOwner = classData.owner === auth.currentUser.uid;

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const db = getFirestore();
                const assignmentCollection = collection(db, 'classrooms', classData.id, 'assignments');
                const querySnapshot = await getDocs(assignmentCollection);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAssignments(data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };
        fetchAssignments();

        const fetchPosts = async () => {
            try {
                const db = getFirestore();
                const postCollection = collection(db, 'classrooms', classData.id, 'posts');
                const querySnapshot = await getDocs(postCollection);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    const addAssignment = async () => {
        const db = getFirestore();
        const assignmentCollection = collection(db, 'classrooms', classData.id, 'assignments');
        const newAssignment = {
            type: selectedType,
            topic: selectedTopic,
            dueDateTime: dueDateTime.toISOString(),
            name: assignmentName,
        };
        try {
            await addDoc(assignmentCollection, newAssignment);
            setIsAddAssignmentModalVisible(false);
            setAssignments([...assignments, newAssignment]);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const addPost = async () => {
        const db = getFirestore();
        const postCollection = collection(db, 'classrooms', classData.id, 'posts');
        const newPost = {
            content: postContent,
            author: auth.currentUser.uid,
            createdAt: new Date().toISOString(),
        };
        try {
            await addDoc(postCollection, newPost);
            setIsAddPostModalVisible(false);
            setPosts([...posts, newPost]);
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const showAddAssignmentModal = () => {
        setIsAddAssignmentModalVisible(true);
    };

    const showAddPostModal = () => {
        setIsAddPostModalVisible(true);
    };
    const navigateToActivityScreen = (assignment) => {
        const { type, topic } = assignment;
        const { language } = classData;
        const selectedLanguage = language.toString();
        const selectedTopic = topic.toString();
        console.log(language, topic);
        console.log(selectedLanguage, selectedTopic);

        switch (type) {
            case 'MultipleChoice':
                navigation.navigate('MCQ', { selectedLanguage });
                break;
            case 'TranslateSentences':
                navigation.navigate('Translate', { selectedLanguage });
                break;
            case 'MatchingCards':
                navigation.navigate("CardMatch", { selectedLanguage, selectedCategory: selectedTopic });
                break;
            case 'Flashcards':
                // Here, we should pass both selectedLanguage and selectedTopic
                navigation.navigate('Flashcards', { selectedLanguage, selectedCategory: selectedTopic });
                break;
            default:
                console.error('Invalid assignment type:', type);
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigateToActivityScreen(item)}>
            <View style={{ backgroundColor: '#ffffff', margin: 10, padding: 20, borderRadius: 10 }}>
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 20 }}>Name: {item.name}</Text>
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Due Date: {new Date(item.dueDateTime).toLocaleString()}</Text>
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Topic: {item.topic}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderPostItem = ({ item }) => (
        <View style={{ backgroundColor: '#ffffff', margin: 10, padding: 20, borderRadius: 10 }}>
            <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>{item.content}</Text>
            <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 14, marginTop: 10 }}>Posted by: {item.author}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            {isOwner && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 }}>
                    <TouchableOpacity onPress={showAddAssignmentModal} style={{ backgroundColor: '#3e588d', padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Add Assignment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showAddPostModal} style={{ backgroundColor: '#3e588d', padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Add Post</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Assignments:</Text>
            <FlatList
                data={assignments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Updates:</Text>
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={item => item.id}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddAssignmentModalVisible}
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
                        <Text style={{ marginBottom: 5 }}>Due Date:</Text>
                        <DateTimePicker
                            value={dueDateTime}
                            mode="datetime"
                            display="default"
                            onChange={(event, selectedDate) => setDueDateTime(selectedDate || dueDateTime)}
                            minimumDate={new Date()}
                        />
                        <Text style={{ marginBottom: 5 }}>Select Assignment Type:</Text>
                        <BoxPicker
                            options={[
                                { label: '--Select Assignment Type--', value: '' },
                                { label: 'Multiple Choice', value: 'MultipleChoice' },
                                { label: 'Translate Sentences', value: 'TranslateSentences' },
                                { label: 'Matching Cards', value: 'MatchingCards' },
                                { label: 'Flashcards', value: 'Flashcards' },
                            ]}
                            selectedValue={selectedType}
                            onValueChange={setSelectedType}
                        />
                        <Text style={{ marginBottom: 5 }}>Select A Category:</Text>
                        <BoxPicker
                            options={[
                                { label: '--Select A Category--', value: '' },
                                { label: 'Basic Vocabulary', value: 'Basic' },
                                { label: 'Family Members', value: 'Family' },
                                { label: 'Food', value: 'Food' },
                                { label: 'Common Phrases', value: 'Phrases' },
                                { label: 'Animals', value: 'Animals' },
                                { label: 'Colors', value: 'Colors' },
                                { label: 'Verbs', value: 'Verbs' },
                                { label: 'Emotions', value: 'Emotions' },
                            ]}
                            selectedValue={selectedTopic}
                            onValueChange={setSelectedTopic}
                        />
                        <Button title="Add" onPress={addAssignment} />
                        <Button title="Cancel" onPress={() => setIsAddAssignmentModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddPostModalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Add Post</Text>
                        <TextInput
                            placeholder="Write your post here"
                            value={postContent}
                            onChangeText={setPostContent}
                            multiline={true}
                            style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10, height: 150 }}
                        />
                        <Button title="Post" onPress={addPost} />
                        <Button title="Cancel" onPress={() => setIsAddPostModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AssignmentScreen;
