// authTokenStorage.js
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

// Save token securely
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (e) {
    console.error("Failed to save token:", e);
  }
};

// Retrieve token
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error("Failed to get token:", e);
    return null;
  }
};

// Delete token (e.g., on logout)
export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error("Failed to delete token:", e);
  }
};
