import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import CameraResultScreen from "../screens/CameraResultScreen";
import useAuth from "../hooks/useAuth";
import FlashcardScreen from "../screens/FlashcardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CardMatchScreen from "../screens/CardMatchScreen";
import ActivityScreen from "../screens/ActivityScreen";
import ClassroomScreen from "../screens/ClassroomScreen";
import AssignmentScreen from "../screens/AssignmentScreen";
import TranslateScreen from "../screens/TranslateScreen";
import TranslateHomeScreen from "../screens/TranslateHomeScreen";
import MCQScreen from "../screens/MCQScreen";
import MCQHomeScreen from "../screens/MCQHomeScreen";

const Stack = createNativeStackNavigator();

const DashScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DashboardTab">
      <Stack.Screen
        name="Classroom"
        options={{ headerShown: false }}
        component={ClassroomScreen}
      />
      <Stack.Screen
        name="Assignment"
        options={{ headerShown: false }}
        component={AssignmentScreen}
      />
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="Flashcards"
        options={{ headerShown: false }}
        component={FlashcardScreen}
      />
      <Stack.Screen
        name="CameraTab"
        options={{ headerShown: false }}
        component={CameraScreen}
      />
      <Stack.Screen
        name="CameraResult"
        options={{ headerShown: false }}
        component={CameraResultScreen}
      />
      <Stack.Screen
        name="ProfileTab"
        options={{ headerShown: false }}
        component={ProfileScreen}
      />
      <Stack.Screen
        name="CardMatch"
        options={{ headerShown: false }}
        component={CardMatchScreen}
      />
      <Stack.Screen
        name="MCQ"
        options={{ headerShown: false }}
        component={MCQScreen}
      />
      <Stack.Screen
        name="Translate"
        options={{ headerShown: false }}
        component={TranslateScreen}
      />
        <Stack.Screen
            name="TranslateHome"
            options={{ headerShown: false }}
            component={TranslateHomeScreen}
        />
        <Stack.Screen
            name="MCQHome"
            options={{ headerShown: false }}
            component={MCQHomeScreen}
        />

    </Stack.Navigator>
  );
};
export { DashScreenNavigator };

const CameraScreenNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="CameraTab">
            <Stack.Screen
                name="ClassroomTab"
                options={{ headerShown: false }}
                component={ClassroomScreen}
            />
            <Stack.Screen
                name="Home"
                options={{ headerShown: false }}
                component={HomeScreen}
            />
            <Stack.Screen
                name="Flashcards"
                options={{ headerShown: false }}
                component={FlashcardScreen}
            />

            <Stack.Screen
                name="CameraResult"
                options={{ headerShown: false }}
                component={CameraResultScreen}
            />
            <Stack.Screen
                name="Profile"
                options={{ headerShown: false }}
                component={ProfileScreen}
            />
            <Stack.Screen
                name="CardMatch"
                options={{ headerShown: false }}
                component={CardMatchScreen}
            />
            <Stack.Screen
                name="MCQ"
                options={{ headerShown: false }}
                component={MCQScreen}
            />

            <Stack.Screen
                name="Camera"
                options={{ headerShown: false }}
                component={CameraScreen}
            />
        </Stack.Navigator>
    );
};
export { CameraScreenNavigator };



const ProfileScreenNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="ProfileTab">
            <Stack.Screen
                name="Profile"
                options={{ headerShown: false }}
                component={ProfileScreen}
            />
        </Stack.Navigator>
    );
};
export { ProfileScreenNavigator };