import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/native";
import routes from "../routes";

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <Screen style={styles.container}>
      <Text className="text-3xl font-bold text-center uppercase">
        React Native Assignment
      </Text>
     
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    color: "#fff",
    fontSize: 28,
    textTransform: "uppercase",
  },
  baseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "20",
    justifyContent: "space-around",
  },

  button: {
    backgroundColor: "blue",
    padding: 10,
    width: 156,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
