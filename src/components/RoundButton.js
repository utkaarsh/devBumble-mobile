import React, { useCallback, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

function RoundButton({ name, size, color, onPress }) {
  const scale = useRef(new Animated.Value(1))?.current;
  const animateScale = useCallback(
    (newValue) => {
      Animated.spring(scale, {
        toValue: newValue,
        friction: 4,
        useNativeDriver: true,
      }).start();
    },
    [scale]
  );

  return (
    <TouchableWithoutFeedback
      delayPressIn={0}
      onPressIn={() => {
        animateScale(0.8);
      }}
      delayPressOut={110}
      onPressOut={() => {
        animateScale(1);
        onPress();
      }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <FontAwesome name={name} size={size} color={color} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 40,
  },
  text: {
    color: "#000",
  },
});

export default RoundButton;
