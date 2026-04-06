import React from "react";
import { Text, View } from "react-native";

// ─── Password strength bar ──────────────────────────────────────────────────
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "#2F3740" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "", color: "#2F3740" },
    { label: "Weak", color: "#FF5E7D" },
    { label: "Fair", color: "#FFB347" },
    { label: "Good", color: "#4A9EFF" },
    { label: "Strong", color: "#3DD68C" },
  ];
  return { score, ...map[score] };
};

const StrengthBar = ({ password }) => {
  const { score, label, color } = getStrength(password);
  return (
    <View className="mt-1 mb-3">
      <View className="flex-row gap-1">
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className="flex-1 h-1 rounded-full"
            style={{ backgroundColor: i <= score ? color : "#2F3740" }}
          />
        ))}
      </View>
      {label ? (
        <Text className="text-xs mt-1" style={{ color }}>
          {label} password
        </Text>
      ) : null}
    </View>
  );
};

export default StrengthBar;
