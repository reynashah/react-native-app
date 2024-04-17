import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { LogBox } from "react-native";
import AppNavigation from "./navigation/appNavigation";

export default function App() {
  LogBox.ignoreAllLogs();
  return <AppNavigation />;
}
