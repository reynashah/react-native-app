import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Loginscreen';
import SignUpScreen from '../screens/SignUpScreen';
import useAuth from '../hooks/useAuth';
import FlashcardScreen from '../screens/FlashcardScreen';

const Stack = createNativeStackNavigator();


export default function AppNavigation() {
    const {user} = useAuth();
    if(user){
        return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
          <Stack.Screen name="Flashcards" options={{headerShown: false}} component={FlashcardScreen} />
          <Stack.Screen name="Dashboard" options={{headerShown: false}} component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
        )
    }
    else{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  )
    }
}