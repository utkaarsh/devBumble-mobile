import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TinderPage from "../screens/TinderPage";
import Authentication from "../screens/Authentication";

export const HomeNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={TinderPage} />
      <Stack.Screen name="login" component={Authentication} />
    </Stack.Navigator>
  );
};
