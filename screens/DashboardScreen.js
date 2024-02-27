import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <View className="flex-1 flex justify-around my-4">
        <Text className="text-white font-bold text-4xl text-center">
          Dashboard
        </Text>
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera")}
            className="py-3 bg-sky-200 mx-7 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Camera Translator
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
