import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import { normalizeImageUrl } from "../utils/chatUtils";

const fetchChatList = async () => {
  const response = await api.get("/chats");
  const chats = (response.data?.data || []).map((chat) => ({
    ...chat,

    photoUrl: normalizeImageUrl(chat.photoUrl),

    lastMessage: chat.lastMessage
      ? {
          ...chat.lastMessage,
          createdAt: chat.lastMessage.createdAt || null,
        }
      : null,

    lastMessageAt: chat.lastMessageAt || null,
  }));

  const suggestions = (response.data?.suggestions || []).map((user) => ({
    ...user,
    photoUrl: normalizeImageUrl(user.photoUrl),
  }));

  return {
    chats,
    suggestions,
  };
};

const useChatList = () => {
  return useQuery({
    queryKey: ["chat-list"],
    queryFn: fetchChatList,
    refetchOnWindowFocus: false,
  });
};

export default useChatList;
