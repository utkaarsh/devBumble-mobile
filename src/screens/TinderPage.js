import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import Screen from "../components/Screen";
import FooterButton from "../components/FooterButton";
import UserCard from "../components/UserCard";
import useFeedData from "../hooks/useFeedData";

export default function TinderPage() {
  const [feedData, setFeedData] = useState([]);
  const tiltSign = useRef(new Animated.Value(1)).current;
  const topCardRef = useRef(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedData();

  // ✅ Flatten all pages — guard every level
  useEffect(() => {
    if (!data?.pages) return;

    const allUsers = data.pages.flatMap((page) => {
      // ✅ page.data could be undefined if backend shape changes
      if (!Array.isArray(page?.data)) return [];
      return page.data;
    });

    // ✅ Deduplicate by _id in case of refetch overlap
    const seen = new Set();
    const unique = allUsers.filter((user) => {
      if (!user?._id || seen.has(user._id)) return false;
      seen.add(user._id);
      return true;
    });

    setFeedData(unique);
  }, [data]);

  // ✅ Prefetch next page when running low
  useEffect(() => {
    if (
      Array.isArray(feedData) &&
      feedData.length <= 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [feedData.length, hasNextPage, isFetchingNextPage]);

  const removeTopCard = useCallback(() => {
    setFeedData((prev) => (Array.isArray(prev) ? prev.slice(1) : []));
  }, []);

  const handleChoice = useCallback((direction) => {
    topCardRef.current?.swipeOut(direction);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A9EFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text className="text-red-500 text-center text-lg p-4">
          Error loading feed
        </Text>
      </View>
    );
  }

  if (
    Array.isArray(feedData) &&
    feedData.length === 0 &&
    !hasNextPage &&
    !isLoading
  ) {
    return (
      <View style={styles.centered}>
        <Text className="text-white text-xl font-bold">
          You've seen everyone!
        </Text>
        <Text className="text-[#5A6677] text-sm mt-2">
          Check back later for new profiles
        </Text>
      </View>
    );
  }

  return (
    <Screen style={styles.container}>
      {Array.isArray(feedData) &&
        feedData
          .map((user, index) => {
            if (!user?._id) return null; // ✅ guard malformed entries
            const isFirst = index === 0;
            return (
              <UserCard
                key={user._id}
                user={user}
                isFirst={isFirst}
                index={index}
                tiltSign={tiltSign}
                onRemove={removeTopCard}
                ref={isFirst ? topCardRef : null}
              />
            );
          })
          .reverse()}

      {isFetchingNextPage && (
        <ActivityIndicator
          size="small"
          color="#4A9EFF"
          style={{ position: "absolute", bottom: 120 }}
        />
      )}

      <FooterButton handleChoice={handleChoice} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D232A",
    alignItems: "center",
    zIndex: 10,
  },
  centered: {
    flex: 1,
    backgroundColor: "#1D232A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
