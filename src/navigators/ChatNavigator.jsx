import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ChatScreen from "../screens/ChatScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";

const Stack = createStackNavigator();

export const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatScreen} />
      {/* <Stack.Screen name="ChatDetail" component={ChatDetailScreen} /> */}
    </Stack.Navigator>
  );
};
