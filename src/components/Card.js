import React from "react";
import { View } from "react-native";

const Card = ({ children, className }) => {
  return (
    <View
      className={`bg-[#15191E] p-4 rounded-lg gap-2 mt-6 mx-2 ${className || ""}`}
    >
      {children}
    </View>
  );
};

export default Card;
