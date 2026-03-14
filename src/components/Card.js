import React from "react";
import { View } from "react-native";

const Card = ({ children, className }) => {
  return (
    <View
      className={`bg-[#15191E] rounded-2xl p-4 gap-2 mt-6 mx-2 ${className || ""}`}
    >
      {children}
    </View>
  );
};

export default Card;
