import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Screen from "../components/Screen";
import { usePaginatedList } from "../hooks/usePaginatedList";
import ListUsersCard from "../components/ListUsersCard";

const Connections = ({ listType = "test", route, navigation }) => {
  const apiUrl = route?.params?.apiUrl;
  const { data, loading, refreshing, loadMore, refresh } =
    usePaginatedList(apiUrl);

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => <ListUsersCard item={item} />}
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
              No connections found
            </Text>
          )
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </Screen>
  );
};

export default Connections;
