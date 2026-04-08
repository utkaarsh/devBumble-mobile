import React, { useContext, useEffect, useState } from "react";
import Screen from "../components/Screen";
import AuthContext from "../auth/context";
import ProfileCard from "../components/ProfileCard";
import { ActivityIndicator, Text, View } from "react-native";
import api from "../utils/api";
import RequestBox from "../components/RequestBox";
import { ScrollView } from "react-native";

const ViewUserProfile = ({ route }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRequested, setHasRequested] = useState(false);

  const { id } = route.params;

  const getProfileData = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/profile/view/${id}`);
      const checkRequest = res?.data?.hasRequested;
      if (checkRequest) setHasRequested(true);
      setUser(res.data?.user);
    } catch (error) {
      console.error(
        "Error fetching profile data: ",
        error?.response?.data?.message || error.message,
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProfileData(id);
  }, [id]);
  return (
    <Screen className="flex-1 p-2 flex gap-5">
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : user ? (
        <ScrollView className="p-2 mb-24">
          {hasRequested && <RequestBox user={user} />}
          <ProfileCard data={user} />
        </ScrollView>
      ) : (
        <Text className="text-center text-gray-500">
          User profile not available
        </Text>
      )}
    </Screen>
  );
};

export default ViewUserProfile;
