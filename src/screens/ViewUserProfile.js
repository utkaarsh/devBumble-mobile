import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import Screen from "../components/Screen";
import AuthContext from "../auth/context";
import ProfileCard from "../components/ProfileCard";
import RequestBox from "../components/RequestBox";
import api from "../utils/api";

const ViewUserProfile = ({ route, navigation }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [theirRequest, setTheirRequest] = useState(false);
  const [myRequest, setMyRequest] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Store the actual connection request ID.
  const [requestId, setRequestId] = useState(null);

  const { user: currentUser } = useContext(AuthContext);

  const { id } = route.params;

  /* -------------------------------------------------------------------------- */
  /*                             Fetch profile data                             */
  /* -------------------------------------------------------------------------- */

  const getProfileData = async (userId) => {
    try {
      setLoading(true);

      const res = await api.get(`/profile/view/${userId}`);

      const profileData = res.data?.data;

      setUser(profileData || null);

      const connection = profileData?.connection;
      const connectionStatus = profileData?.connectionStatus;

      /*
        Determine who sent the request.

        If your backend returns ObjectIds, convert them to strings
        before comparing them.
      */

      const fromUserId = connection?.fromUserId?._id || connection?.fromUserId;

      const toUserId = connection?.toUserId?._id || connection?.toUserId;

      const currentUserId = currentUser?._id;

      const theirRequest =
        (res.data?.data?.connection?.fromUserId === id &&
          res.data?.data?.connectionStatus === "interested") ||
        false;
      const myRequest =
        (res.data?.data?.connection?.fromUserId === "me" &&
          res.data?.data?.connectionStatus === "interested") ||
        false;

      const connected = connectionStatus === "accepted";

      setTheirRequest(theirRequest);
      setMyRequest(myRequest);
      setIsConnected(connected);

      // Save request ID for cancel/review actions
      setRequestId(connection?._id || null);
    } catch (error) {
      console.error(
        "Error fetching profile data:",
        error?.response?.data?.message || error.message,
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && currentUser?._id) {
      getProfileData(id);
    }
  }, [id, currentUser?._id]);

  /* -------------------------------------------------------------------------- */
  /*                          Send connection request                           */
  /* -------------------------------------------------------------------------- */

  const sendConnectionRequest = async () => {
    try {
      setActionLoading(true);
      const res = await api.post(`/request/send/interested/${id}`);
      const createdRequest = res.data?.data || res.data?.connectionRequest;

      if (createdRequest?._id) {
        setRequestId(createdRequest._id);
      }

      setMyRequest(true);
      setTheirRequest(false);
      setIsConnected(false);
    } catch (error) {
      console.error(
        "Error sending connection request:",
        error?.response?.data?.message || error.message,
      );

      Alert.alert(
        "Unable to connect",
        error?.response?.data?.message ||
          "Something went wrong while sending the request.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                           Cancel connection request                        */
  /* -------------------------------------------------------------------------- */

  const cancelConnectionRequest = () => {
    if (!requestId) {
      Alert.alert("Error", "Connection request ID is missing.");

      return;
    }

    Alert.alert(
      "Cancel request?",
      `Cancel your connection request to ${user?.firstName}?`,
      [
        {
          text: "Keep Request",
          style: "cancel",
        },
        {
          text: "Cancel Request",
          style: "destructive",
          onPress: performCancelConnectionRequest,
        },
      ],
    );
  };

  const performCancelConnectionRequest = async () => {
    try {
      setActionLoading(true);

      await api.delete(`/request/cancel/${requestId}`);

      setMyRequest(false);
      setRequestId(null);
    } catch (error) {
      console.error(
        "Error cancelling connection request:",
        error?.response?.data?.message || error.message,
      );

      Alert.alert(
        "Unable to cancel",
        error?.response?.data?.message ||
          "Something went wrong while cancelling the request.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              Remove connection                             */
  /* -------------------------------------------------------------------------- */

  const removeConnection = () => {
    Alert.alert(
      "Remove connection?",
      `Are you sure you want to remove ${user?.firstName} from your connections?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: performRemoveConnection,
        },
      ],
    );
  };

  const performRemoveConnection = async () => {
    try {
      setActionLoading(true);

      await api.delete(`/request/remove/${id}`);

      setIsConnected(false);
      setMyRequest(false);
      setTheirRequest(false);
      setRequestId(null);
    } catch (error) {
      console.error(
        "Error removing connection:",
        error?.response?.data?.message || error.message,
      );

      Alert.alert(
        "Unable to remove",
        error?.response?.data?.message ||
          "Something went wrong while removing the connection.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Loading                                   */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <Screen className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    UI                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <Screen className="flex-1 p-2">
      {user ? (
        <ScrollView
          className="mb-24 flex-1 p-2"
          showsVerticalScrollIndicator={false}
        >
          {/* ---------------------------------------------------------------- */}
          {/* Connection Status                                                */}
          {/* ---------------------------------------------------------------- */}

          <View className="mb-3 rounded-2xl bg-[#15191E] px-5 py-4 pb-5">
            <Text className="text-lg font-semibold text-white">
              Connection Status
            </Text>

            {/* -------------------------------------------------------------- */}
            {/* Incoming Request                                               */}
            {/* -------------------------------------------------------------- */}

            {theirRequest && (
              <>
                <Text className="mb-4 mt-1 text-gray-400">
                  {user.firstName} wants to connect with you.
                </Text>

                <RequestBox user={user} requestId={requestId} />
              </>
            )}

            {/* -------------------------------------------------------------- */}
            {/* No Connection                                                  */}
            {/* -------------------------------------------------------------- */}

            {!theirRequest && !myRequest && !isConnected && (
              <>
                <View className="mt-2 flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-gray-400" />

                  <Text className="font-medium text-gray-300">
                    Not Connected
                  </Text>
                </View>

                <Text className="mb-5 mt-2 text-gray-400">
                  Send a connection request to start networking.
                </Text>

                <TouchableOpacity
                  disabled={actionLoading}
                  onPress={sendConnectionRequest}
                  className={`items-center rounded-xl py-3 ${
                    actionLoading ? "bg-blue-900" : "bg-blue-600"
                  }`}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="font-semibold text-white">+ Connect</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* -------------------------------------------------------------- */}
            {/* Pending Request                                                */}
            {/* -------------------------------------------------------------- */}

            {myRequest && !isConnected && (
              <>
                <View className="mt-2 flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />

                  <Text className="font-medium text-yellow-400">
                    Request Pending
                  </Text>
                </View>

                <Text className="mt-2 text-gray-400">
                  Your connection request has been sent. You'll be notified once
                  it's accepted.
                </Text>

                <TouchableOpacity
                  disabled={actionLoading}
                  onPress={cancelConnectionRequest}
                  className="mt-5 rounded-xl border border-yellow-500 py-3"
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#EAB308" />
                  ) : (
                    <Text className="text-center font-semibold text-yellow-500">
                      Cancel Request
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* -------------------------------------------------------------- */}
            {/* Connected                                                      */}
            {/* -------------------------------------------------------------- */}

            {isConnected && (
              <>
                <View className="mt-2 flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-green-500" />

                  <Text className="font-medium text-green-400">Connected</Text>
                </View>

                <Text className="mb-5 mt-2 text-gray-400">
                  You're connected and can now interact with each other.
                </Text>

                <View className="flex-row">
                  {/* Message */}

                  <TouchableOpacity
                    className="mr-2 flex-1 rounded-xl bg-blue-600 py-3"
                    onPress={() =>
                      navigation.navigate("ChatDetail", { chat: user })
                    }
                  >
                    <Text className="text-center font-semibold text-white">
                      Message
                    </Text>
                  </TouchableOpacity>

                  {/* Remove */}

                  <TouchableOpacity
                    disabled={actionLoading}
                    onPress={removeConnection}
                    className="ml-2 flex-1 rounded-xl border border-red-500 py-3"
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#EF4444" />
                    ) : (
                      <Text className="text-center font-semibold text-red-500">
                        Remove
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* Profile                                                          */}
          {/* ---------------------------------------------------------------- */}

          <ProfileCard data={user} />
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">User profile not available</Text>
        </View>
      )}
    </Screen>
  );
};

export default ViewUserProfile;
