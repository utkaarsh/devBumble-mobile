import React, { useContext, useEffect } from "react";
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
import { HomeNavigator } from "./HomeNavigator";
import { requestLocationPermission } from "../services/location/locationPermission";
import { getCurrentLocation } from "../services/location/locationService";
import { syncLocationToBackend } from "../services/location/locationSync";
import { createStackNavigator } from "@react-navigation/stack";
import ChatDetailScreen from "../screens/ChatDetailScreen";

export default function AppNavigator() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext); // ✅ consumed INSIDE the provider
  useEffect(() => {
    if (!user) return;

    initializeLocation();
  }, [user]);

  const RootStack = createStackNavigator();

  const RootTabs = () => (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={TabNavigator} />
      <RootStack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </RootStack.Navigator>
  );

  //initialize location tracking
  const initializeLocation = async () => {
    try {
      const granted = await requestLocationPermission();

      if (!granted) {
        console.log("Location permission denied");
        return;
      }

      const location = await getCurrentLocation();

      if (!location) return;

      await syncLocationToBackend(location, true);
    } catch (err) {
      console.log("Init Location Error:", err);
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DarkTheme}>
      <StatusBar style="dark" backgroundColor="#D5D5D5" translucent={false} />
      {user ? <RootTabs /> : <AuthNavigator />}
    </ThemeProvider>
  );
}
