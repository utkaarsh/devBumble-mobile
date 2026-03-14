import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { path } from "../utils/path";

const sendRequest = async ({ status, toUserId }) => {
  const res = await axios.post(`${path}/request/send/${status}/${toUserId}`);
  return res.data;
};

export const useSendRequest = () => {
  return useMutation({
    mutationFn: sendRequest,
    onSuccess: (data) => {
      console.log("Request sent ::", data.message);
    },
    onError: (err) => {
      console.error("Request error ::", err.response?.data || err.message);
    },
  });
};
