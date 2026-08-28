import React, { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

import Screen from "../components/Screen";
import useChatList from "../hooks/useChatList";
import { formatChatTimestamp } from "../utils/chatUtils";
import ListUsersCard from "../components/ListUsersCard";
import SocketContext from "../socket/SocketContext";
import AuthContext from "../auth/context";

const ChatScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user: currentUser } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const {
    data = { chats: [], suggestions: [] },
    isLoading,
    isError,
    error,
  } = useChatList();

  const chats = data?.chats || [];
  const suggestions = data?.suggestions || [];

  useEffect(() => {
    if (!socket) return;

    const handleUnreadCountUpdated = ({ chatId, unreadCount }) => {
      queryClient.setQueryData(["chat-list"], (current) => {
        if (!current) return current;

        return {
          ...current,
          chats: current.chats.map((chat) =>
            chat.chatId?.toString() === chatId?.toString()
              ? { ...chat, unreadCount }
              : chat,
          ),
        };
      });
    };

    socket.on("unreadCountUpdated", handleUnreadCountUpdated);
    return () => socket.off("unreadCountUpdated", handleUnreadCountUpdated);
  }, [socket, queryClient]);

  // ==================================================
  // HANDLE REAL-TIME CHAT LIST UPDATES
  // ==================================================

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdated = (updatedChat) => {
      console.log("Chat list updated:", updatedChat);

      queryClient.setQueryData(["chat-list"], (currentData) => {
        if (!currentData) {
          return {
            chats: [updatedChat],
            suggestions: [],
          };
        }

        const currentChats = currentData.chats || [];
        const currentSuggestions = currentData.suggestions || [];

        const normalizedChat = {
          ...updatedChat,
          lastMessage: updatedChat.lastMessage
            ? {
                ...updatedChat.lastMessage,
                createdAt: updatedChat.lastMessage.createdAt || null,
              }
            : null,
          lastMessageAt: updatedChat.lastMessageAt || null,
        };

        const filteredChats = currentChats.filter(
          (chat) =>
            chat.chatId?.toString() !== normalizedChat.chatId?.toString(),
        );

        // Remove this user from suggestions now that they have a chat
        const filteredSuggestions = currentSuggestions.filter(
          (s) => s._id?.toString() !== normalizedChat.userId?.toString(),
        );

        return {
          chats: [normalizedChat, ...filteredChats],
          suggestions: filteredSuggestions,
        };
      });
    };

    socket.on("chatUpdated", handleChatUpdated);

    return () => {
      socket.off("chatUpdated", handleChatUpdated);
    };
  }, [socket, queryClient]);

  // ==================================================
  // NAVIGATION
  // ==================================================

  const handleNavigation = (chat) => {
    navigation.navigate("ChatDetail", {
      chat,
    });
  };

  // ==================================================
  // CHAT ITEM
  // ==================================================

  const renderItem = ({ item }) => {
    const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");
    const userId = currentUser?._id;
    const lastMessageText = item.lastMessage?.text || "No messages yet";

    const isMine =
      item.lastMessage?.senderId?.toString() === userId?.toString();

    const isUnread = !isMine && !(item.lastMessage?.seen ?? false);
    const unreadCount = item.unreadCount || 0;
    console.log("Unread count ", unreadCount);
    console.log(" is Unread ", isUnread);

    const avatarSource = item.photoUrl ? { uri: item.photoUrl } : null;

    return (
      <Pressable
        onPress={() => handleNavigation(item)}
        className="flex-row items-center px-4 py-3 border-b border-[#2A323B]"
      >
        {avatarSource ? (
          <View className="w-14 h-14 rounded-full overflow-hidden">
            <Image
              source={avatarSource}
              className="w-full h-auto"
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
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

            {/* Timestamp restored to what it should show */}
            <Text className="text-[#8A94A6] text-xs">
              {formatChatTimestamp(item.lastMessage?.createdAt)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-1">
            <Text
              className={`text-sm flex-1 ${
                unreadCount && !isMine > 0
                  ? "font-bold text-white"
                  : "text-[#8A94A6] font-normal"
              }`}
              numberOfLines={1}
            >
              {isMine ? `${lastMessageText}` : lastMessageText}
            </Text>

            {/* Per-row unread badge */}
            {unreadCount > 0 && (
              <View className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#4F8EF7] items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {unreadCount > 4 ? "4+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (isLoading) {
    return (
      <Screen
        style={{
          backgroundColor: "#15191E",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </Screen>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (isError) {
    return (
      <Screen
        style={{
          backgroundColor: "#15191E",
          justifyContent: "center",
        }}
      >
        <Text className="text-center text-red-400 px-6">
          {error?.message || "Unable to load chats right now."}
        </Text>
      </Screen>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <Screen>
      <View>
        <Text className="text-white text-lg font-semibold mt-4 mb-2 px-4">
          Messages
        </Text>

        {/* ================================
            CHAT LIST
        ================================= */}

        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
          ListEmptyComponent={
            <Text className="text-[#8A94A6] text-center mt-10">
              No chats yet.
            </Text>
          }
        />

        {/* ================================
            SUGGESTIONS
        ================================= */}

        {suggestions.length > 0 && (
          <Text className="text-white text-lg font-semibold mt-4 mb-2 px-4">
            Suggestions
          </Text>
        )}

        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <ListUsersCard
              item={item}
              onPress={(user) => {
                navigation.navigate("ChatDetail", {
                  chat: user,
                });
              }}
            />
          )}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? <ActivityIndicator color="#fff" /> : null
          }
          ListEmptyComponent={() => <View />}
          contentContainerStyle={{
            padding: 6,
          }}
        />
      </View>
    </Screen>
  );
};

export default ChatScreen;
