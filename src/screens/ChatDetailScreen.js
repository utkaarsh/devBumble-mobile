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
  console.log("Parameter", route.params);

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
  const otherUserId = chat?.userId;
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
    }
    setNewMessage("");
  };

  const fetchChatMessages = async () => {
    try {
      const res = await api.get(`/chat/${otherUserId}`);

      const chatMessages = res.data.messages.map((msg) => ({
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
      console.log(err);
    }
  };
  const flatListRef = useRef(null);

  // Fallback: still attempt a scroll whenever the messages array changes.
  useEffect(() => {
    if (!messages.length) return;

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

  useEffect(() => {
    if (!socket) return;
    if (messages.length > 0) {
      socket.emit("mark-as-seen", { userId, otherUserId });
    }
    const handleSeen = ({ seenBy }) => {
      setMessages((prev) => {
        const lastMyIndex = [...prev]
          .map((msg) => msg.senderId)
          .lastIndexOf(userId);

        if (lastMyIndex === -1) return prev;

        return prev.map((msg, index) =>
          index === lastMyIndex ? { ...msg, seen: true } : msg,
        );
      });
    };

    socket.on("messagesSeen", handleSeen);

    return () => socket.off("messagesSeen", handleSeen);
  }, [socket, messages, socket, userId, otherUserId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-chat", {
      userId,
      otherUserId,
      firstName,
    });

    const handleMessage = (message) => {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          // Temporary client-side id until the backend sends the real _id.
          // Date.now() alone can collide if two messages land in the same
          // millisecond, which breaks FlatList's keyExtractor. Add a random
          // suffix to guarantee uniqueness.
          _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          senderId: message.senderId,
          firstName: message.firstName,
          lastName: message.lastName,
          photoUrl: message.photoUrl,
          text: message.text,
          createdAt: message.createdAt,
          delivered: true,
          seen: false,
        },
      ]);
    };

    socket.on("messageRecieved", handleMessage);

    return () => {
      socket.off("messageRecieved", handleMessage);
    };
  }, [socket, userId, otherUserId]);

  return (
    <Screen style={{ backgroundColor: "#000" }}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A323B]">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-white text-xl">←</Text>
        </Pressable>
        {avatarSource ? (
          <Image source={avatarSource} className="w-12 h-12 rounded-full" />
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
