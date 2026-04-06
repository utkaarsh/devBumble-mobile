import React, { useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProgressBar = ({ step, TOTAL, STEPS }) => {
  const progress = ((step + 1) / TOTAL) * 100;
  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-3">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <View key={i} className="items-center flex-1">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                  done
                    ? "bg-[#3DD68C]"
                    : active
                      ? "bg-[#4A9EFF]"
                      : "bg-[#2F3740]"
                }`}
              >
                {done ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Ionicons
                    name={s.icon}
                    size={14}
                    color={active ? "#fff" : "#5A6677"}
                  />
                )}
              </View>
              <Text
                className={`text-xs font-semibold ${
                  done
                    ? "text-[#3DD68C]"
                    : active
                      ? "text-[#4A9EFF]"
                      : "text-[#3D4855]"
                }`}
              >
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="h-1 bg-[#2F3740] rounded-full overflow-hidden">
        <View
          className="h-full rounded-full bg-[#4A9EFF]"
          style={{ width: `${progress}%` }}
        />
      </View>
      <Text className="text-[#3D4855] text-xs mt-1 text-right">
        Step {step + 1} of {TOTAL}
      </Text>
    </View>
  );
};

export default ProgressBar;
