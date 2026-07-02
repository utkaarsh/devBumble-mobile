import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SearchUsers from "../screens/SearchUsers";
import ViewUserProfile from "../screens/ViewUserProfile";

const Stack = createStackNavigator();

export const SearchNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchUsers" component={SearchUsers} />
      <Stack.Screen
        name="ViewUserProfile"
        component={ViewUserProfile}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
