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
  const [isConnected, setIsConnected] = useState(false);
  const { user: currentUser } = useContext(AuthContext); // ✅ consumed INSIDE the provider

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
      const isConnected = res.data?.data?.connectionStatus === "accepted";
      setTheirRequest(theirRequest);
      setMyRequest(myRequest);
      setIsConnected(isConnected);
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
          <View className="bg-[#15191E] rounded-2xl  px-5 py-2 mb-3 pb-5 shadow-sm border ">
            <Text className="text-lg font-semibold text-gray-900">
              Connection Status
            </Text>

            {/* Incoming Request */}
            {theirRequest && (
              <>
                <Text className="text-gray-500 mt-1 mb-4">
                  {user.firstName} wants to connect with you.
                </Text>

                <RequestBox user={user} />
              </>
            )}

            {/* No Connection */}
            {!theirRequest && !myRequest && !isConnected && (
              <>
                <View className="flex-row items-center mt-1">
                  <View className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
                  <Text className="text-gray-700 font-medium">
                    Not Connected
                  </Text>
                </View>

                <Text className="text-gray-500 mt-2 mb-5">
                  Send a connection request to start networking.
                </Text>

                <TouchableOpacity
                  onPress={sendConnectionRequest}
                  className="bg-blue-600 rounded-xl py-3"
                >
                  <Text className="text-center text-white font-semibold">
                    + Connect
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Pending */}
            {myRequest && !isConnected && (
              <>
                <View className="flex-row items-center mt-1">
                  <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                  <Text className="text-yellow-700 font-medium">
                    Request Pending
                  </Text>
                </View>

                <Text className="text-gray-500 mt-2">
                  Your connection request has been sent. You'll be notified once
                  it's accepted.
                </Text>

                <TouchableOpacity className="mt-5 border border-yellow-500 rounded-xl py-3">
                  <Text className="text-center text-yellow-700 font-semibold">
                    Cancel Request
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Connected */}
            {isConnected && (
              <>
                <View className="flex-row items-center mt-1">
                  <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <Text className="text-green-700 font-medium">Connected</Text>
                </View>

                <Text className="text-gray-500 mt-2 mb-5">
                  You're connected and can now interact with each other.
                </Text>

                <View className="flex-row">
                  <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl py-3 mr-2">
                    <Text className="text-center text-white font-semibold">
                      Message
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-1 border border-red-300 rounded-xl py-3 ml-2">
                    <Text className="text-center text-red-500 font-semibold">
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
