import { useQuery } from "@tanstack/react-query";
import { fetchChatList } from "./useChatList"; // adjust path as needed

const useUnreadTotal = () => {
  const { data } = useQuery({
    queryKey: ["chat-list"],
    queryFn: fetchChatList, // same fetcher — React Query dedupes this
    select: (data) =>
      (data?.chats || []).filter((c) => (c.unreadCount || 0) > 0).length,
  });
  return data ?? 0;
};

export default useUnreadTotal;
