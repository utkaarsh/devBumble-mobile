import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity } from "react-native";

const ListUsersCard = ({ item, renderActions }) => {
  const navigation = useNavigation();
  console.log("IDS :: ", item._id);
  return (
    <View
      style={{
        backgroundColor: "#15191E",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("ViewUserProfile", { id: item._id })}
        style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <Image
          source={{ uri: item.photoUrl }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View>
          <Text
            style={{ color: "#fff", fontWeight: "bold" }}
            className="w-48 whitespace-normal break-words"
          >
            {item.firstName} {item.lastName}
          </Text>
          <Text style={{ color: "#aaa" }}>
            {item.age}, {item.gender}
          </Text>
          <Text
            style={{ color: "#aaa", fontSize: 12 }}
            className="max-w-56 whitespace-normal break-words"
          >
            {item.about}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Injected from parent */}
      {renderActions?.(item)}
    </View>
  );
};

export default ListUsersCard;
