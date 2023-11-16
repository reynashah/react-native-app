import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function HomeScreen() {
    const handleLogout = async ()=>{
        await signOut(auth);
    }
    const handleFlashcard = async ()=>{
      await signOut(auth);
  }
  return (
    <SafeAreaView className="flex-1 flex-row justify-center items-center bg-sky-100">
      <Text className=" text-xl font-bold">Home Page </Text>
      <TouchableOpacity onPress={handleLogout} className="p-1 bg-red-400 rounded-lg">
        <Text className="text-white text-lg font-bold">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFlashcard} className="p-1 bg-sky-300 rounded-lg">
        <Text className="text-white text-lg font-bold">Flashcards</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}