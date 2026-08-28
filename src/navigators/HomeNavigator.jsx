import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TinderPage from "../screens/TinderPage";
import Connections from "../screens/Connections";
import Requests from "../screens/Requests";
import ViewUserProfile from "../screens/ViewUserProfile";

export const HomeNavigator = ({ navigation }) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main screen */}
      <Stack.Screen name="FeedHome" component={TinderPage} />

      {/* Secondary screens (tabs stay visible) */}
      <Stack.Screen
        name="Matches"
        options={{ headerShown: true }}
        component={Connections}
      />
      <Stack.Screen
        name="Requests"
        options={{ headerShown: true }}
        component={Requests}
      />
      <Stack.Screen
        name="ViewUserProfile"
        options={{ headerShown: false }}
        component={ViewUserProfile}
      />
    </Stack.Navigator>
  );
};
