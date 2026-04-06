import { TouchableOpacity, Text } from "react-native";

const ActionButton = ({
  label,
  onPress,
  color = "#6C7BFF",
  className = "",
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: color,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
    }}
    className={className}
  >
    <Text style={{ color: "#fff" }}>{label}</Text>
  </TouchableOpacity>
);

export default ActionButton;
