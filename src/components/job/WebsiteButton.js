import { EvilIcons } from "@expo/vector-icons";
import React from "react";
import { Linking, Text, TouchableOpacity } from "react-native";

const WebsiteButton = ({ url, title = "Visit Website" }) => {
  const handlePress = async () => {
    if (!url) return;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Could not open URL:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="rounded-lg bg-blue-600 px-4 py-3 w-48 flex-row items-center justify-center gap-1"
    >
      <Text className="text-center font-semibold text-white">{title}</Text>
      <EvilIcons name="external-link" size={18} color="white" />
    </TouchableOpacity>
  );
};

export default WebsiteButton;
