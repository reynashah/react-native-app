import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import CameraResultScreen from "../screens/CameraResultScreen";
import FlashcardScreen from "../screens/FlashcardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CardMatchScreen from "../screens/CardMatchScreen";
import ActivityScreen from "../screens/ActivityScreen";
import ClassroomScreen from "../screens/ClassroomScreen";
import AssignmentScreen from "../screens/AssignmentScreen";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="CameraResult" component={CameraResultScreen} />
            <Stack.Screen name="Flashcards" component={FlashcardScreen} />
            <Stack.Screen name="CardMatch" component={CardMatchScreen} />
        </Stack.Navigator>
    );
};

const ClassroomNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Classroom" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Classroom" component={ClassroomScreen} />
            <Stack.Screen name="Assignment" component={AssignmentScreen} />
        </Stack.Navigator>
    );
};

const ActivityNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Activity" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Activity" component={ActivityScreen} />
        </Stack.Navigator>
    );
};

export { MainNavigator, ClassroomNavigator, ActivityNavigator };
