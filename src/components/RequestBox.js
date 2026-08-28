import React from "react";
import { Text, ToastAndroid, View } from "react-native";
import { appColors } from "../utils/styles";
import ActionButton from "./ActionButton";
import api from "../utils/api";
import { col10 } from "../utils/utility";

const RequestBox = ({ user }) => {
  const handleAccept = (item) => {
    handleDecision(item._id, "accepted");
  };
  const handleReject = (item) => {
    handleDecision(item._id, "rejected");
  };

  const handleDecision = async (id, action) => {
    try {
      const response = api.post(`/request/review/${action}/${id}`);

      if ((await response).data.success) {
        ToastAndroid.show(
          `Request ${action}ed successfully`,
          ToastAndroid.SHORT,
        );
      }
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

  return (
    <View
      style={{ backgroundColor: appColors.secondary }}
      className="p-4  rounded-lg shadow m-2"
    >
      {/* <Text className="text-gray-100 text-base">
        {user?.firstName} wants to connect with you
      </Text> */}
      <View
        style={{ width: col10 }}
        className="flex-row items-center justify-center relative gap-4 my-2 pt-3 mx-4 "
      >
        <ActionButton
          label="Accept"
          className="w-5/12 flex-row justify-center"
          color="#4CAF50"
          onPress={() => handleAccept(user)}
        />
        <ActionButton
          label="Reject"
          className="w-5/12 flex-row justify-center"
          color="#EC3826"
          onPress={() => handleReject(user)}
        />
      </View>
    </View>
  );
};

export default RequestBox;
