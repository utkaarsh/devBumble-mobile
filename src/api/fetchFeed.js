import axios from "axios";
import { path } from "../utils/path";
import { getToken } from "../auth/authTokenStorage";

export const fetchFeed = async () => {
  const token = await getToken();

  const res = await axios.get(`${path}/user/feed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
