import { View, Text, Platform } from 'react-native'
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import CameraResultScreen from '../screens/CameraResultScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Loginscreen';
import SignUpScreen from '../screens/SignUpScreen';
import useAuth from '../hooks/useAuth';
import FlashcardScreen from '../screens/FlashcardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CardMatchScreen from '../screens/CardMatchScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {DashScreenNavigator, CameraScreenNavigator, ActivityScreenNavigator, ProfileScreenNavigator} from './customNavigation'
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ActivityScreen from "../screens/ActivityScreen";
import ClassroomScreen from "../screens/ClassroomScreen";




const Tab = createBottomTabNavigator();
const screenOptions = {
    tabBarShowLabel:false,
    headerShown:false,
    tabBarStyle:{
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
    const {user} = useAuth();
    if (user) {
        return (
            <NavigationContainer>
                <Tab.Navigator screenOptions={screenOptions}>
                    <Tab.Screen
                        name="Classrooms"
                        component={ClassroomScreen}
                        options={{
                            tabBarIcon: ({focused}) => {
                                return (
                                    <View style={{alignItems: "center", justifyContent: "center"}}>
                                        <Entypo name="home" size={24} color={focused ? "#16247d" : "#111"}/>
                                        <Text style={{fonSize: 12, color: "#16247d"}}>HOME</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                    <Tab.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            tabBarIcon: ({focused}) => {
                                return (
                                    <View style={{alignItems: "center", justifyContent: "center"}}>
                                        <Entypo name="wallet" size={24} color={focused ? "#16247d" : "#111"}/>
                                        <Text style={{fonSize: 12, color: "#16247d"}}>CAMERA</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                    <Tab.Screen
                        name="Activity"
                        component={ActivityScreen}
                        options={{
                            tabBarIcon: ({focused}) => {
                                return (
                                    <View style={{alignItems: "center", justifyContent: "center"}}>
                                        <MaterialIcons name="stacked-line-chart" size={24}
                                                       color={focused ? "#16247d" : "#111"}/>
                                        <Text style={{fonSize: 12, color: "#16247d"}}>ACTIVITY</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            tabBarIcon: ({focused}) => {
                                return (
                                    <View style={{alignItems: "center", justifyContent: "center"}}>
                                        <Ionicons name="settings" size={24} color={focused ? "#16247d" : "#111"}/>
                                        <Text style={{fonSize: 12, color: "#16247d"}}>PROFILE</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        )
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Welcome'>
                    <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen}/>
                    <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen}/>
                    <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen}/>

                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}