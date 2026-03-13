import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import LoginForm from "../components/LoginForm";

const Authentication = () => {
  const styles = StyleSheet.create({
    text: {
      color: "#000",
    },
    container: {
      flex: 1,
    },
  });

  return (
    <Screen style={styles.container}>
      <LoginForm />
    </Screen>
  );
};

export default Authentication;
