import { useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SocketContext from "../socket/SocketContext";
import useChatList from "../hooks/useChatList"; // triggers the actual fetch

// Mount this ONCE near the app root (e.g. inside SocketProvider's
// children, or right alongside <TabNavigator />) — NOT inside ChatScreen.
// It has no UI; its only job is to keep ["chat-list"] warm and current
// no matter which tab is on screen.
const ChatListSync = () => {
  const socket = useContext(SocketContext);
  const queryClient = useQueryClient();

  // This actually fires the fetch — enabled by default — so the cache
  // is populated as soon as the app loads, not on first Chat tab visit.
  useChatList();

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdated = (updatedChat) => {
      queryClient.setQueryData(["chat-list"], (currentData) => {
        if (!currentData) {
          return { chats: [updatedChat], suggestions: [] };
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

        const filteredSuggestions = currentSuggestions.filter(
          (s) => s._id?.toString() !== normalizedChat.userId?.toString(),
        );

        return {
          chats: [normalizedChat, ...filteredChats],
          suggestions: filteredSuggestions,
        };
      });
    };

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

    socket.on("chatUpdated", handleChatUpdated);
    socket.on("unreadCountUpdated", handleUnreadCountUpdated);

    return () => {
      socket.off("chatUpdated", handleChatUpdated);
      socket.off("unreadCountUpdated", handleUnreadCountUpdated);
    };
  }, [socket, queryClient]);

  return null; // no UI — pure side-effect component
};

export default ChatListSync;
