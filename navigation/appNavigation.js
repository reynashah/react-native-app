import { View, Text, Platform } from 'react-native'
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Loginscreen';
import SignUpScreen from '../screens/SignUpScreen';
import ClassroomScreen from '../screens/ClassroomScreen';
import useAuth from '../hooks/useAuth';
import AssignmentScreen from "../screens/AssignmentScreen";
import MatchingCards from "../screens/CardMatchScreen"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
    const { user } = useAuth();

    if (user) {
        return (
            <NavigationContainer>
                <Stack.Screen name="Assignment" component={AssignmentScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SelectionCards" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MatchingCards" component={MatchingCards} options={{ headerShown: false }} />




                <Tab.Navigator
                    screenOptions={{
                        tabBarShowLabel: false,
                        headerShown: false,
                        tabBarStyle: {
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            left: 0,
                            elevation: 0,
                            height: 75,
                            background: '#fff',
                        },
                    }}>
                    <Tab.Screen
                        name="Home"
                        component={ClassroomScreen}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Entypo name="home" size={24} color={focused ? '#16247d' : '#111'} />
                                    <Text style={{ fontSize: 12, color: '#16247d' }}>HOME</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Entypo name="wallet" size={24} color={focused ? '#16247d' : '#111'} />
                                    <Text style={{ fontSize: 12, color: '#16247d' }}>CAMERA</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Activity"
                        component={ActivityScreen}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialIcons
                                        name="stacked-line-chart"
                                        size={24}
                                        color={focused ? '#16247d' : '#111'}
                                    />
                                    <Text style={{ fontSize: 12, color: '#16247d' }}>ACTIVITY</Text>
                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name="settings" size={24} color={focused ? '#16247d' : '#111'} />
                                    <Text style={{ fontSize: 12, color: '#16247d' }}>PROFILE</Text>
                                </View>
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
};

export default AppNavigation;
