import React from "react";
import { View, Text } from "react-native";

const Chips = ({ items = [] }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item, index) => (
        <View
          key={index}
          className="bg-[#3D4855] border border-[#3D4855] px-3 py-1 rounded-full"
        >
          <Text className="text-white text-sm">{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default Chips;
