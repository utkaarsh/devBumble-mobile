import React from "react";
import { Text } from "react-native";

const H6 = ({ children, className = "" }) => {
  return (
    <Text className={`text-sm  ${className} text-gray-400`}>{children}</Text>
  );
};

export default H6;
