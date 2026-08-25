import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../services/notifications/notificationServices";
import { timeAgo } from "../utils/utility";

/* -------------------------------------------------------------------------- */
/*                              Notification Row                              */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              Empty State                                   */
/* -------------------------------------------------------------------------- */

const EmptyNotifications = () => {
  return (
    <View className="items-center px-10 pt-32">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-[#3D4855]">
        <Ionicons name="notifications-outline" size={38} color="#CBD5E1" />
      </View>

      <Text className="mt-4 text-xl font-semibold text-white">
        No notifications yet
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-gray-400">
        When someone interacts with you, you'll see it here.
      </Text>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Notification Screen                             */
/* -------------------------------------------------------------------------- */

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState(new Set());
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const NotificationItem = memo(({ item, onPress }) => {
    const getNotificationIcon = () => {
      switch (item.type) {
        case "CHAT_MESSAGE":
          return {
            name: "chatbubble-ellipses",
            color: "#38BDF8",
          };

        case "FRIEND_REQUEST":
          return {
            name: "person-add",
            color: "#22C55E",
          };

        case "FRIEND_ACCEPTED":
          return {
            name: "people",
            color: "#A78BFA",
          };

        case "LIKE":
          return {
            name: "heart",
            color: "#EC4899",
          };

        case "COMMENT":
          return {
            name: "chatbubble",
            color: "#F59E0B",
          };

        default:
          return {
            name: "notifications",
            color: "#94A3B8",
          };
      }
    };

    const icon = getNotificationIcon();

    return (
      <Pressable
        onPress={() => onPress(item)}
        className={`mx-4 mb-2 flex-row items-center rounded-2xl px-4 py-3 ${
          highlightedIds.has(item._id) ? "bg-[#3D4855]" : "bg-[#15191E]"
        }`}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Profile Picture                                                    */}
        {/* ------------------------------------------------------------------ */}

        <View className="mr-3">
          {item.photoUrl ? (
            <Image
              source={{ uri: item.photoUrl }}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#3D4855]">
              <Ionicons name="person" size={22} color="#CBD5E1" />
            </View>
          )}

          {/* Notification type badge */}
          <View
            className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full rounded-full border-2 border-[#15191E]"
            style={{
              backgroundColor: icon.color,
            }}
          >
            <Ionicons name={icon.name} size={12} color="#FFFFFF" />
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Notification Content                                               */}
        {/* ------------------------------------------------------------------ */}

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center">
            <Text
              numberOfLines={1}
              className="flex-1 text-[15px] font-semibold text-white"
            >
              {item.title}
            </Text>

            <Text className="ml-2 text-[11px] text-gray-400">
              {timeAgo(item.createdAt)}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            className="mt-1 text-[14px] leading-5 text-gray-300"
          >
            {item.body}
          </Text>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Unread Indicator                                                    */}
        {/* ------------------------------------------------------------------ */}

        {!item.isRead && (
          <View className="ml-2 h-2.5 w-2.5 rounded-full bg-cyan-400" />
        )}
      </Pressable>
    );
  });

  const markVisibleNotificationsAsRead = async (notifications) => {
    const unreadIds = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification._id);

    if (unreadIds.length === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead(unreadIds);

      setNotifications((prev) =>
        prev.map((notification) =>
          unreadIds.includes(notification._id)
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const loadMoreNotifications = useCallback(async () => {
    if (loadingMore || !hasMore || !nextCursor) {
      return;
    }

    try {
      setLoadingMore(true);

      const response = await getNotifications({
        limit: 20,
        before: nextCursor,
      });

      setNotifications((prev) => [...prev, ...response.notifications]);

      setNextCursor(response.pagination.nextCursor);

      setHasMore(response.pagination.hasMore);
    } catch (error) {
      console.error("Failed to load more notifications:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, nextCursor]);

  /* ------------------------------------------------------------------------ */
  /* Handle notification press                                               */
  /* ------------------------------------------------------------------------ */
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getNotifications({
        limit: 20,
      });

      setNotifications(response.notifications);

      setNextCursor(response.pagination.nextCursor);

      setHasMore(response.pagination.hasMore);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNotificationPress = useCallback((notification) => {
    console.log("Notification pressed:", notification);

    /*
      Later we can navigate based on notification type.

      Example:

      if (notification.type === "CHAT_MESSAGE") {
        navigation.navigate("Chat", {
          chatId: notification.data.chatId,
        });
      }

      if (notification.type === "FRIEND_REQUEST") {
        navigation.navigate("FriendRequests");
      }
    */
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Pull to refresh                                                          */
  /* ------------------------------------------------------------------------ */

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      const response = await getNotifications({
        limit: 20,
      });

      setNotifications(response.notifications);

      setNextCursor(response.pagination.nextCursor);

      setHasMore(response.pagination.hasMore);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Render notification                                                      */
  /* ------------------------------------------------------------------------ */

  const renderItem = useCallback(
    ({ item }) => (
      <NotificationItem item={item} onPress={handleNotificationPress} />
    ),
    [handleNotificationPress],
  );

  /* ------------------------------------------------------------------------ */
  /* Empty list                                                               */
  /* ------------------------------------------------------------------------ */

  const renderEmptyComponent = useCallback(() => <EmptyNotifications />, []);

  /* ------------------------------------------------------------------------ */
  /* Screen                                                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!notifications.length) {
      return;
    }

    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead,
    );

    if (!unreadNotifications.length) {
      return;
    }

    const ids = unreadNotifications.map((notification) => notification._id);

    setHighlightedIds(new Set(ids));

    const timer = setTimeout(async () => {
      try {
        await markVisibleNotificationsAsRead(ids);

        setNotifications((prev) =>
          prev.map((notification) =>
            ids.includes(notification._id)
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          ),
        );

        setHighlightedIds(new Set());
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <View className="flex-1 bg-[#15191E]">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <View className="px-5 pb-4 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white">Notifications</Text>

            <Text className="mt-1 text-sm text-gray-400">
              Stay updated with your activity
            </Text>
          </View>

          {/* Mark all as read */}
        </View>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Notification List                                                  */}
      {/* ------------------------------------------------------------------ */}

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: 30,
          flexGrow: notifications.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FFFFFF"
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-5">
              <Text className="text-center text-gray-400">Loading...</Text>
            </View>
          ) : null
        }
        removeClippedSubviews
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
    </View>
  );
};

export default NotificationFeed;
