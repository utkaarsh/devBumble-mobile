import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { col8 } from "../utils/constants";
import { path } from "../utils/path";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { saveToken } from "../auth/authTokenStorage";
import AuthContext from "../auth/context";

const LoginForm = () => {
  const TOKEN_KEY = "auth_token";
  const EXPIRY_KEY = "token_expiry";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("michael.martin3@example.in");
  const [password, setPassword] = useState("hitler123");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${path}/login`, {
        emailId: email,
        password: password,
      });

      await saveToken(res.data.token); // ✅ save to SecureStore
      authContext.setUser(res.data); // ✅ update context → triggers navigation
      console.log("Token set to storage successfully!!");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text) => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F4F4F4",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#000",
    },
    inputField: {
      width: col8,
      backgroundColor: "white",
      borderRadius: 15,
      borderWidth: 2,
      borderColor: "#3A3A3A",
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
  });

  return (
    <View style={styles.container} className="">
      <View className="flex p-5 space-y-3 bg-[#D5D5D5] rounded-lg h-2/6 justify-evenly">
        <TextInput
          placeholder="Email"
          style={styles.inputField}
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          keyboardAppearance="dark"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          textContentType="password"
        />

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-[#3A3A3A] self-center gap-3 flex-row items-center justify-center w-64 py-2 rounded-lg"
        >
          {loading && <ActivityIndicator color={"#fff"} size={20} />}
          <Text className="text-white text-xl ">
            {loading ? "Signing in.." : "Login"}
          </Text>
        </TouchableOpacity>

        {
          errorMessage && showToast(errorMessage)
          // <Text className="text-[#EC3826] text-sm text-center p-1">
          //   {errorMessage}
          // </Text>
        }
      </View>
    </View>
  );
};

export default LoginForm;
