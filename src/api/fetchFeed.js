import api from "../utils/api";

export const fetchFeed = async () => {
  const res = await api.get("/user/feed");

  return res.data;
};
