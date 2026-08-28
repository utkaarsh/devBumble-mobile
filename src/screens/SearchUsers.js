import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Screen from "../components/Screen";
import api from "../utils/api";
import { useSelector } from "react-redux";

const PAGE_SIZE = 10;
const MIN_QUERY_LENGTH = 2;

const SearchResultCard = ({ item, onPress }) => {
  const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");
  const meta = [item.age, item.gender].filter(Boolean).join(", ");
  const skills = Array.isArray(item.skills) ? item.skills.slice(0, 3) : [];

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      className="mb-1 mx-2 flex-row gap-3 rounded-xl border border-[#2F3740] bg-[#15191E] px-2 py-3"
      onPress={onPress}
    >
      {item.photoUrl ? (
        <View className="w-12 h-12 bg-black rounded-full overflow-hidden">
          <Image
            source={{ uri: item.photoUrl }}
            className="w-full h-auto"
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#2F3740]">
          <Ionicons name="person" size={28} color="#A6ADBB" />
        </View>
      )}

      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text
            className="flex-1 text-base font-bold text-[#EFF2F5]"
            numberOfLines={1}
          >
            {fullName || "Unnamed user"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6F7A86" />
        </View>

        {/* {meta ? (
          <Text className="text-sm text-[#A6ADBB]" numberOfLines={1}>
            {meta}
          </Text>
        ) : null} */}

        {/* {item.about ? (
          <Text className="text-xs leading-4 text-[#8695A4]" numberOfLines={2}>
            {item.about}
          </Text>
        ) : null} */}

        {skills.length > 0 ? (
          <View className="mt-1 flex-row flex-wrap gap-1.5">
            {skills.map((skill) => (
              <View key={skill} className="rounded-lg bg-[#252C35] px-2 py-1">
                <Text className="text-[11px] text-[#A6ADBB]">{skill}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const SearchUsers = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);
  // const user = useSelector((state) => state.auth.user);
  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= MIN_QUERY_LENGTH;

  const fetchUsers = useCallback(
    async ({
      pageNumber = 1,
      isRefresh = false,
      searchText = trimmedQuery,
    }) => {
      const normalizedQuery = searchText.trim();

      if (normalizedQuery.length < MIN_QUERY_LENGTH) {
        setResults([]);
        setHasMore(false);
        setError("");
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");

        const res = await api.get("/users/search", {
          params: {
            q: normalizedQuery,
            page: pageNumber,
            limit: PAGE_SIZE,
          },
        });

        if (requestId !== requestIdRef.current) return;

        const nextResults = res.data?.data || [];
        setResults((prev) =>
          pageNumber === 1 ? nextResults : [...prev, ...nextResults],
        );
        setHasMore(Boolean(res.data?.hasMore));
        setPage(pageNumber);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        const message =
          err?.response?.data?.error || err.message || "Search failed";
        setError(message);
        if (pageNumber === 1) setResults([]);
        setHasMore(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [trimmedQuery],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers({ pageNumber: 1, searchText: trimmedQuery });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [fetchUsers, trimmedQuery]);

  const loadMore = () => {
    if (!loading && !refreshing && hasMore) {
      fetchUsers({ pageNumber: page + 1 });
    }
  };

  const refresh = () => {
    fetchUsers({ pageNumber: 1, isRefresh: true });
  };

  const renderEmpty = () => {
    if (loading || refreshing) return null;

    if (!canSearch) {
      return (
        <View className="mt-16 items-center px-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#15191E]">
            <Ionicons name="search" size={30} color="#A6ADBB" />
          </View>
          <Text className="text-center text-lg font-semibold text-[#EFF2F5]">
            Find developers
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-[#8695A4]">
            Search by name, skill, or interest. Type at least 2 characters.
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="mt-16 items-center px-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#2A2025]">
            <Ionicons name="alert-circle-outline" size={30} color="#FF7A90" />
          </View>
          <Text className="text-center text-base font-semibold text-[#FF7A90]">
            Search failed
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-[#8695A4]">
            {error}
          </Text>
        </View>
      );
    }

    return (
      <View className="mt-16 items-center px-8">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#15191E]">
          <Ionicons name="people-outline" size={30} color="#A6ADBB" />
        </View>
        <Text className="text-center text-lg font-semibold text-[#EFF2F5]">
          No users found
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-[#8695A4]">
          Try a different name, skill, or interest.
        </Text>
      </View>
    );
  };

  return (
    <Screen>
      <View className="mt-2 bg-black px-4 py-4">
        <Text className="text-xl font-bold text-[#EFF2F5]">Search</Text>
        <Text className="mt-1 text-sm text-[#8695A4]">
          Discover people by name, skills, and interests.
        </Text>
      </View>

      <View className="mt-3 mx-2 flex-row items-center gap-2 rounded-xl border border-[#2F3740] bg-[#15191E] px-3">
        <Ionicons name="search" size={20} color="#A6ADBB" />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          className="min-h-12 flex-1 text-base text-[#fff]"
          onChangeText={setQuery}
          placeholder="Search developers"
          placeholderTextColor="#6F7A86"
          returnKeyType="search"
          selectionColor="#A6ADBB"
          underlineColorAndroid="transparent"
          value={query}
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        ) : null}
      </View>
      {loading && (
        <ActivityIndicator className="mt-4" color="#EC3826" size="large" />
      )}
      <View className="flex flex-row items-center justify-between gap-2 px-4 py-2">
        <Text className="text-sm text-[#8695A4]">
          {results.length > 0
            ? `Showing ${results.length} result${results.length > 1 ? "s" : ""}`
            : canSearch
              ? "No results"
              : "Type at least 2 characters to search"}
        </Text>
      </View>

      {results?.length > 0 ? (
        <FlatList
          className="mt-3 flex-1"
          // contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
          data={results}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <SearchResultCard
              item={item}
              onPress={() =>
                navigation.navigate("ViewUserProfile", { id: item._id })
              }
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        />
      ) : null}
    </Screen>
  );
};

export default SearchUsers;
