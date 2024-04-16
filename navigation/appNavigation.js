import { View, Text, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ClassroomScreen from "../screens/ClassroomScreen";
import CameraScreen from '../screens/CameraScreen';
import CameraResultScreen from '../screens/CameraResultScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Loginscreen';
import SignUpScreen from '../screens/SignUpScreen';
import useAuth from '../hooks/useAuth';
import FlashcardScreen from '../screens/FlashcardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CardMatchScreen from '../screens/CardMatchScreen';
import AssignmentScreen from '../screens/AssignmentScreen'; // Import the AssignmentScreen component
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClassroomScreenNavigator, CameraScreenNavigator, ActivityScreenNavigator, ProfileScreenNavigator } from './customNavigation';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();
const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 75,
        background: "#fff"
    }
}

const Stack = createNativeStackNavigator();


export default function AppNavigation() {
    const { user } = useAuth();
    if (user) {
        return (
            <NavigationContainer>
                <Tab.Navigator screenOptions={screenOptions}>
                    <Tab.Screen
                        name="Classrooms"
                        component={ClassroomScreen}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Entypo name="home" size={24} color={focused ? "#16247d" : "#111"} />
                                        <Text style={{ fontSize: 12, color: "#16247d" }}>HOME</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                    <Tab.Screen
                        name="Camera"
                        component={CameraScreenNavigator}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Entypo name="wallet" size={24} color={focused ? "#16247d" : "#111"} />
                                        <Text style={{ fontSize: 12, color: "#16247d" }}>CAMERA</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                    <Tab.Screen
                        name="Activity"
                        component={ActivityScreenNavigator}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <MaterialIcons name="stacked-line-chart" size={24} color={focused ? "#16247d" : "#111"} />
                                        <Text style={{ fontSize: 12, color: "#16247d" }}>ACTIVITY</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreenNavigator}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons name="settings" size={24} color={focused ? "#16247d" : "#111"} />
                                        <Text style={{ fontSize: 12, color: "#16247d" }}>PROFILE</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
    else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Welcome'>
                    <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
                    <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                    <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
                    <Stack.Screen name="Classroom" options={{ headerShown: false }} component={ClassroomScreen} />
                    <Stack.Screen name="AssignmentScreen" component={AssignmentScreen} /> {/* Add AssignmentScreen to the stack */}
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
