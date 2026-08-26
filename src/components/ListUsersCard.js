import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity } from "react-native";

const ListUsersCard = ({ item, renderActions, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress(item);
      return;
    }

    // Default behavior for existing components
    navigation.navigate("ViewUserProfile", {
      id: item._id,
    });
  };

  const ProfileImage = ({ uri, size = 50 }) => {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          backgroundColor: "#2A323B",
        }}
      >
        <Image
          source={{ uri }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="contain"
        />
      </View>
    );
  };

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
        onPress={handlePress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ProfileImage uri={item.photoUrl} size={50} />

        <View className="space-y-3">
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
            }}
            className="w-48 whitespace-normal break-words"
          >
            {item.firstName} {item.lastName}
          </Text>

          <Text
            style={{
              color: "#aaa",
              fontSize: 12,
            }}
            className="max-w-56 whitespace-normal break-words"
          >
            {item.about}
          </Text>
        </View>
      </TouchableOpacity>

      {renderActions?.(item)}
    </View>
  );
};

export default ListUsersCard;
