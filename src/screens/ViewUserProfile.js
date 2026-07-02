import React, { useContext, useEffect, useState } from "react";
import Screen from "../components/Screen";
import AuthContext from "../auth/context";
import ProfileCard from "../components/ProfileCard";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import api from "../utils/api";
import RequestBox from "../components/RequestBox";
import { ScrollView } from "react-native";

const ViewUserProfile = ({ route }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theirRequest, setTheirRequest] = useState(false);
  const [myRequest, setMyRequest] = useState(false);

  const { id } = route.params;

  const getProfileData = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/profile/view/${id}`);
      setUser(res.data?.data || null);
      const theirRequest =
        (res.data?.data?.connection?.fromUserId === id &&
          res.data?.data?.connectionStatus === "interested") ||
        false;
      const myRequest =
        (res.data?.data?.connection?.fromUserId === "me" &&
          res.data?.data?.connectionStatus === "interested") ||
        false;
      setTheirRequest(theirRequest);
      setMyRequest(myRequest);
      console.log(
        "Connection log",
        res.data?.data?.connection || "No connection data",
      );
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

  const { user: currentUser } = useContext(AuthContext);
  const sendConnectionRequest = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/request/send/interested/${id}`);
      console.log("Connection request sent: ", res.data);
      setMyRequest(true);
    } catch (error) {
      console.error(
        "Error sending connection request: ",
        error?.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="flex-1 p-2 flex gap-5">
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : user ? (
        <ScrollView className="p-2 mb-24 flex-1">
          {theirRequest && <RequestBox user={user} />}
          {!theirRequest && !myRequest && (
            <TouchableOpacity
              className="bg-white w-40 mt-2 self-center rounded-lg py-2"
              onPress={sendConnectionRequest}
            >
              <Text className="text-center text-sm font-light uppercase text-gray-950">
                Add connection
              </Text>
            </TouchableOpacity>
          )}

          {myRequest && (
            <Text className="text-center  text-green-500">Request Sent</Text>
          )}
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
