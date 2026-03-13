import React, { useContext } from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AuthContext from "../auth/context";
import AuthNavigator from "./AuthNavigator";
import { TabNavigator } from "./TabNavigator";

export default function AppNavigator() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext); // ✅ consumed INSIDE the provider

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="dark" backgroundColor="#D5D5D5" translucent={false} />
      {user ? <TabNavigator /> : <AuthNavigator />}
    </ThemeProvider>
  );
}
