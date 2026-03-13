import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import "../global.css";
import appStore from "./store/appStore";
import { AuthProvider } from "./auth/AuthProvider";
import AppNavigator from "./navigators/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={appStore}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
