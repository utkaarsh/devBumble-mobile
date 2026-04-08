import axios from "axios";
import { path } from "../utils/path";
import { getToken } from "../auth/authTokenStorage";

const api = axios.create({
  baseURL: path,
  timeout: 10000,
});

// 🔥 Request interceptor (auto attach token)
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log("Token generated for request:", config.url);

    if (!token) {
      console.warn("No token found for request:", config.url);
      return config;
    }

    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
