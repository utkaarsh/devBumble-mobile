import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { appColors } from "../utils/styles";

const TextHead = ({
  icon,
  iconName = "",
  size = 24,
  label,
  onPress,
  className = "",
}) => {
  return (
    <Pressable onPress={onPress}>
      <View className={`flex flex-row gap-1.5 items-start ${className}`}>
        {icon ? (
          icon
        ) : (
          <MaterialIcons name={iconName} size={size} color={appColors.accent} />
        )}

        <Text className="text-white text-lg ml-2">{label}</Text>
      </View>
    </Pressable>
  );
};

export default TextHead;
