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
      // backgroundColor: "#000",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
      borderColor: color,
      borderWidth: 1,
    }}
    className={className}
  >
    <Text style={{ color: color }}>{label}</Text>
  </TouchableOpacity>
);

export default ActionButton;
