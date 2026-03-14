import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";
import appStore from "./store/appStore";
import { AuthProvider } from "./auth/AuthProvider";
import AppNavigator from "./navigators/AppNavigator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={appStore}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
