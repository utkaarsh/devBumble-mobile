import React from "react";
import { Text } from "react-native";

const H1 = ({ children, className = "" }) => {
  return (
    <Text className={`text-base text-white ${className}`}>{children}</Text>
  );
};

export default H1;
