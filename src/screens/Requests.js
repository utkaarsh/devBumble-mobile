import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Screen from "../components/Screen";
import { usePaginatedList } from "../hooks/usePaginatedList";
import ListUsersCard from "../components/ListUsersCard";
import ActionButton from "../components/ActionButton";
import api from "../utils/api";

const Requests = ({ listType = "test", route, navigation }) => {
  const { apiUrl } = route.params || {};
  const { data, loading, refreshing, loadMore, refresh } = usePaginatedList(
    apiUrl || "/user/requests/sent",
  );

  console.log("Request data ", data);

  const handleDecision = async (id, action) => {
    try {
      const response = api.post(`/request/review/${action}/${id}`);
      console.log("Response", (await response).data);

      if ((await response).data.success) {
        ToastAndroid.show(
          `Request ${action}ed successfully`,
          ToastAndroid.SHORT,
        );
      }
      refresh();
    } catch (error) {
      console.log(
        `Error on ${action} :: `,
        error?.response?.data || error.message,
      );
      ToastAndroid.show(
        `Failed to ${action} request: ${
          error?.response?.data?.message || error.message
        }`,
        ToastAndroid.LONG,
      );
    }
  };

  const handleAccept = (item) => {
    handleDecision(item._id, "accepted");
  };
  const handleReject = (item) => {
    handleDecision(item._id, "rejected");
  };

  function hasKeyword(path, keyword) {
    if (!path || !keyword) return false;

    return path.toLowerCase().includes(keyword.toLowerCase());
  }

  const isRecieved = hasKeyword(apiUrl, "recieved");
  const listUsers = ({ item }) => (
    <ListUsersCard
      item={item}
      renderActions={
        isRecieved
          ? (item) => (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <ActionButton
                  label="✓"
                  color="#4CAF50"
                  onPress={() => handleAccept(item)}
                />
                <ActionButton
                  label="✕"
                  color="#F44336"
                  onPress={() => handleReject(item)}
                />
              </View>
            )
          : null
      }
    />
  );

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={listUsers}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refresh}
        ListFooterComponent={
          loading ? <ActivityIndicator color="#fff" /> : null
        }
        ListEmptyComponent={() =>
          !loading && (
            <Text style={{ color: "#888", textAlign: "center" }}>
              No data found
            </Text>
          )
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </Screen>
  );
};

export default Requests;
