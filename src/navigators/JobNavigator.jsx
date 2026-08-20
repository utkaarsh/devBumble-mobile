import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SearchUsers from "../screens/SearchUsers";
import ViewUserProfile from "../screens/ViewUserProfile";
import JobList from "../screens/JobList";

const Stack = createStackNavigator();

export const JobNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobListing" component={JobList} />
      {/* <Stack.Screen
        name="ViewUserProfile"
        component={ViewUserProfile}
        options={{ headerShown: true }}
      /> */}
    </Stack.Navigator>
  );
};
