import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MAIN_COLORS } from "../utils/utility";

function Choice({ type }) {
  const color = MAIN_COLORS[type];
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: color,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color,
          },
        ]}
      >
        {type}{" "}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderWidth: 7,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
  },
  text: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: 4,
  },
});

export default Choice;
