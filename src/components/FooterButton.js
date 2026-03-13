import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MAIN_COLORS } from "../utils/constants";
import RoundButton from "./RoundButton";

function FooterButton({ handleChoice }) {
  return (
    <View
      style={[styles.container]}
      className="flex w-7/12 flex-row items-center justify-between px-3 bottom-24 absolute -z-10"
    >
      <View>
        <RoundButton
          name={"times"}
          size={40}
          color={MAIN_COLORS.like}
          onPress={() => handleChoice(-1)}
        />
      </View>

      <View>
        <RoundButton
          name={"heart"}
          size={34}
          color={MAIN_COLORS.nope}
          onPress={() => handleChoice(1)}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
  text: {
    color: "#000",
  },
});

export default FooterButton;
