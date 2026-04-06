import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { useNavigation } from "@react-navigation/native";

const Authentication = () => {
  const styles = StyleSheet.create({
    text: {
      color: "#000",
    },
    container: {
      flex: 1,
      backgroundColor: "#1D232A",
    },
  });
  const navigation = useNavigation();

  const handleSignupNavigation = () => {
    navigation.navigate("Signup");
  };

  return (
    <Screen style={styles.container}>
      <LoginForm onNavigateToSignup={handleSignupNavigation} />
    </Screen>
  );
};

export default Authentication;
