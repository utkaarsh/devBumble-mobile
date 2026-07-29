import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";
import useChatList from "../hooks/useChatList";
import { formatChatTimestamp } from "../utils/chatUtils";
import { usePaginatedList } from "../hooks/usePaginatedList";
import ListUsersCard from "../components/ListUsersCard";

const ChatScreen = () => {
  const navigation = useNavigation();
  const { data = [], isLoading, isError, error } = useChatList();

  const renderItem = ({ item }) => {
    const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");
    const lastMessageText = item.lastMessage?.text || "No messages yet";
    const avatarSource = item.photoUrl ? { uri: item.photoUrl } : null;

    return (
      <Pressable
        onPress={() => navigation.navigate("ChatDetail", { chat: item })}
        className="flex-row items-center px-4 py-3 border-b border-[#2A323B]"
      >
        {avatarSource ? (
          <Image
            source={avatarSource}
            className="w-14 h-14 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-[#2A323B] items-center justify-center">
            <Text className="text-white text-lg font-semibold">
              {fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View className="flex-1 ml-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base font-semibold">
              {fullName}
            </Text>
            <Text className="text-[#8A94A6] text-xs">
              {formatChatTimestamp(item.lastMessage?.createdAt)}
            </Text>
          </View>

          <Text className="text-[#8A94A6] text-sm mt-1" numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>
      </Pressable>
    );
  };

  const {
    data: suggestionsData,
    loading,
    refreshing,
    loadMore,
    refresh,
  } = usePaginatedList("/user/connections");

  if (isLoading) {
    return (
      <Screen style={{ backgroundColor: "#15191E", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen style={{ backgroundColor: "#15191E", justifyContent: "center" }}>
        <Text className="text-center text-red-400 px-6">
          {error?.message || "Unable to load chats right now."}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen
    //   className="flex items-start justify-between bg-red-400 space-y-2"
    //   style={{ backgroundColor: "#15191E" }}
    >
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.chatId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={
            <Text className="text-[#8A94A6] text-center mt-10">
              No chats yet.
            </Text>
          }
        />
        <Text className="text-white text-lg font-semibold mt-4 mb-2 px-4">
          Suggestions
        </Text>
        <FlatList
          data={suggestionsData}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => <ListUsersCard item={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={refresh}
          ListFooterComponent={
            loading ? <ActivityIndicator color="#fff" /> : null
          }
          ListEmptyComponent={() => !loading && <View />}
          contentContainerStyle={{ padding: 6 }}
        />
      </View>
    </Screen>
  );
};

export default ChatScreen;
