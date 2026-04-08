import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

const sendRequest = async ({ status, toUserId }) => {
  const res = await api.post(`/request/send/${status}/${toUserId}`);
  return res.data;
};

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendRequest,
    onSuccess: (data) => {
      console.log("Request sent ::", data.message);
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
    onError: (err) => {
      console.error("Request error ::", err.response?.data || err.message);
    },
  });
};
