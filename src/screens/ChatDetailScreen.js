import React, { useContext, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";
import { formatChatTimestamp } from "../utils/chatUtils";
import { createSocketConnection } from "../utils/socket";
import AuthContext from "../auth/context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import SocketContext from "../socket/SocketContext";
import { path } from "../utils/path";
import api from "../utils/api";
import { timeAgo } from "../utils/utility";

const ChatDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chat } = route.params || {};
  const { user } = useContext(AuthContext); // ✅ consumed INSIDE the provider
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  if (!chat) {
    return (
      <Screen style={{ backgroundColor: "#15191E", justifyContent: "center" }}>
        <Text className="text-white text-center">Chat not found.</Text>
      </Screen>
    );
  }

  const fullName = [chat.firstName, chat.lastName].filter(Boolean).join(" ");
  const firstName = chat.firstName;
  const avatarSource = chat.photoUrl ? { uri: chat.photoUrl } : null;
  const userId = user?._id;
  const otherUserId = chat?.userId ?? chat?._id;
  const socket = useContext(SocketContext);

  const sendMessage = () => {
    try {
      setLoading(true);
      socket.emit("send-message", {
        firstName: user?.firstName,
        userId,
        lastName: user?.lastName,
        otherUserId,
        text: newMessage,
        photoUrl: user?.photoUrl,
        createdAt: new Date(),
      });
    } catch (error) {
      setLoading(false);
      console.error(error.message || error.msg || error);
    } finally {
      setLoading(false);
    }

    setNewMessage("");
  };

  const fetchChatMessages = async () => {
    try {
      const res = await api.get(`/chat/${otherUserId}/messages`);

      const chatMessages = res.data?.data?.map((msg) => ({
        _id: msg._id,
        senderId: msg.senderId._id,
        firstName: msg.senderId.firstName,
        lastName: msg.senderId.lastName,
        photoUrl: msg.senderId.photoUrl,
        text: msg.text,
        createdAt: msg.createdAt,
        delivered: msg.delivered,
        seen: msg.seen,
      }));

      setMessages(chatMessages);
    } catch (err) {
      console.log("Error Fetching chat details", err?.message || err);
    }
  };
  const flatListRef = useRef(null);

  // Fallback: still attempt a scroll whenever the messages array changes.
  useEffect(() => {
    if (!messages.length) return console.log("No messages", messages);
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    });
  }, [messages]);

  useEffect(() => {
    if (!userId || !otherUserId) return;

    fetchChatMessages();
  }, [userId, otherUserId]);

  // ==================================================
  // JOIN / LEAVE CHAT ROOM
  // ==================================================

  useEffect(() => {
    if (!socket || !userId || !otherUserId) return;

    socket.emit("join-chat", { userId, otherUserId });

    return () => {
      socket.emit("leave-chat", { userId, otherUserId });
    };
  }, [socket, userId, otherUserId]);

  useEffect(() => {
    if (!socket || !userId || !otherUserId) return;
    const handleSeen = ({ seenBy }) => {
      // Only update when the other user marked our messages as seen
      if (seenBy !== otherUserId) return;

      setMessages((prev) => {
        let changed = false;

        const updated = prev.map((msg) => {
          if (msg.senderId === userId && !msg.seen) {
            changed = true;
            return {
              ...msg,
              seen: true,
            };
          }

          return msg;
        });

        // Very important:
        // If nothing actually changed, return the same array reference.
        if (!changed) {
          return prev;
        }

        return updated;
      });
    };

    socket.on("messagesSeen", handleSeen);

    return () => {
      socket.off("messagesSeen", handleSeen);
    };
  }, [socket, userId, otherUserId]);

  useEffect(() => {
    if (!socket || !userId || !otherUserId || !chat?.chatId) {
      console.log("mark-as-seen not returned");
      return;
    }

    socket.emit("mark-as-seen", {
      userId,
      otherUserId,
      chatId: chat.chatId, // not chat._id
    });
    console.log("mark-as-seen hitted", chat.chatId);
  }, [socket, userId, otherUserId, chat?.chatId]);

  useEffect(() => {
    if (!socket || !userId || !otherUserId) {
      return console.log("return log messageReceived");
    }

    const handleMessage = (message) => {
      console.log("messageReceived:", message);

      setLoading(false);

      setMessages((prev) => {
        // ------------------------------------------
        // Prevent duplicate messages
        // ------------------------------------------

        const alreadyExists = prev.some(
          (msg) => msg._id?.toString() === message._id?.toString(),
        );

        if (alreadyExists) {
          return prev;
        }

        return [
          ...prev,
          {
            _id: message._id,

            senderId: message.senderId,

            firstName: message.firstName,

            lastName: message.lastName,

            photoUrl: message.photoUrl,

            text: message.text,

            createdAt: message.createdAt,

            delivered: message.delivered ?? true,

            seen: message.seen ?? false,
          },
        ];
      });
    };

    socket.on("messageReceived", handleMessage);

    return () => {
      socket.off("messageReceived", handleMessage);
    };
  }, [socket, userId, otherUserId]);

  return (
    <Screen style={{ backgroundColor: "#000" }}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A323B]">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-white text-xl">←</Text>
        </Pressable>
        {avatarSource ? (
          <View className="w-12 h-12">
            <Image
              source={avatarSource}
              className="w-full h-auto"
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View className="w-12 h-12 rounded-full bg-[#2A323B] items-center justify-center">
            <Text className="text-white font-semibold">
              {fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View className="ml-3 flex-1">
          <Text className="text-white text-lg font-semibold">{fullName}</Text>
          <Text className="text-[#8A94A6] text-sm">Online</Text>
        </View>
      </View>

      {/* KeyboardAvoidingView wraps the message list + input row so the
          input (and the last message) isn't hidden behind the keyboard. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="bg-black flex-1 px-6">
          {/* Chat Messages list  */}

          <FlatList
            data={messages}
            ref={flatListRef}
            keyExtractor={(item) => item._id}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            // This is the key fix: onContentSizeChange fires right after
            // FlatList actually measures the new content height (i.e. once
            // a newly-added bubble has been laid out), so scrollToEnd()
            // lands on the true bottom instead of the previous height.
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item, index }) => {
              const isMine = item.senderId === userId;

              // Find the last message sent by me
              const isLastMine =
                isMine &&
                index === messages.map((m) => m.senderId).lastIndexOf(userId);

              const fullName = `${item.firstName} ${item.lastName}`;

              return (
                <View
                  className={`mb-4 ${isMine ? "items-end" : "items-start"}`}
                >
                  {/* Header */}
                  <View className="flex-row items-center mb-1">
                    <Text className="text-xs text-[#A6ADBB] font-semibold">
                      {isMine ? "You" : fullName}
                    </Text>

                    <Text className="ml-2 text-[10px] text-[#6F7A86]">
                      {timeAgo(item.createdAt)}
                    </Text>
                  </View>

                  {/* Bubble */}
                  <View
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isMine ? "bg-[#4F8EF7]" : "bg-[#2A323B]"
                    }`}
                  >
                    <Text className="text-white">{item.text}</Text>
                  </View>

                  {/* Footer */}
                  {isLastMine && (
                    <Text className="mt-1 text-[10px] text-[#6F7A86]">
                      {item.seen ? "Seen" : "Delivered"}
                    </Text>
                  )}
                </View>
              );
            }}
          />
        </View>

        {/* Send Message InputBox  */}

        <View className="mt-3 mx-3 mb-3 flex-row items-center gap-2 rounded-full border border-[#2F3740] bg-[#15191E] px-4 py-1">
          <TextInput
            autoCapitalize="none"
            autoCorrect={true}
            className="min-h-12 flex-1 text-base text-[#fff]"
            onChangeText={setNewMessage}
            placeholder="Send message"
            placeholderTextColor="#6F7A86"
            returnKeyType="search"
            selectionColor="#A6ADBB"
            underlineColorAndroid="transparent"
            value={newMessage}
          />

          {newMessage.length > 0 ? (
            <TouchableOpacity onPress={() => setNewMessage("")} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={() => !loading && sendMessage()}>
            {loading ? (
              <ActivityIndicator size={20} color="#A6ADBB" />
            ) : (
              <FontAwesome name="send" size={20} color="#A6ADBB" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ChatDetailScreen;
