import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { path } from "../utils/path";
import axios from "axios";
import { saveToken } from "../auth/authTokenStorage";
import AuthContext from "../auth/context";

const LoginForm = ({ onNavigateToSignup }) => {
  const [email, setEmail] = useState("stella@utkarshranpise.com");
  const [password, setPassword] = useState("StrongP@ssw0rd123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await axios.post(`${path}/login`, {
        emailId: email,
        password: password,
      });
      const token = res.data?.token || res.data?.data?.token;
      if (!token) throw new Error("Login response did not include token");
      await saveToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Prefer profile endpoint so we have the full user object (photoUrl, name, etc.)
      let userData = null;
      try {
        const profile = await axios.get(`${path}/profile/view`);
        userData = profile.data;
      } catch (profileErr) {
        // Fallback to API login data if profile call is unavailable.
        userData = res.data.user || res.data;
      }

      authContext.setUser(userData);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1  items-center justify-center px-6 bg-black">
      {/* Card */}
      <View className="w-full bg-[#1D232A] rounded-2xl p-7 border border-[#252C35]">
        {/* Header */}
        <View className="mb-7">
          <Text className="text-[#EFF2F5] text-2xl font-bold mb-1">
            Welcome back
          </Text>
          <Text className="text-[#5A6677] text-sm">Sign in to Dev Bumble</Text>
        </View>

        {/* Email field */}
        <View className="mb-4">
          <Text className="text-[#8695A4] text-xs font-semibold mb-2 uppercase tracking-widest">
            Email
          </Text>
          <View
            className={`flex-row items-center bg-[#15191E] rounded-xl px-4 border-2 ${
              focusedField === "email" ? "border-[#4A9EFF]" : "border-[#2F3740]"
            }`}
          >
            <Ionicons
              name="mail-outline"
              size={18}
              color={focusedField === "email" ? "#4A9EFF" : "#5A6677"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 text-[#EFF2F5] text-base py-4"
              placeholder="you@example.com"
              placeholderTextColor="#3D4855"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Password field */}
        <View className="mb-4">
          <Text className="text-[#8695A4] text-xs font-semibold mb-2 uppercase tracking-widest">
            Password
          </Text>
          <View
            className={`flex-row items-center bg-[#15191E] rounded-xl px-4 border-2 ${
              focusedField === "password"
                ? "border-[#4A9EFF]"
                : "border-[#2F3740]"
            }`}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={focusedField === "password" ? "#4A9EFF" : "#5A6677"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 text-[#EFF2F5] text-base py-4"
              placeholder="Your password"
              placeholderTextColor="#3D4855"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
              className="p-1 ml-2"
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#5A6677"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error message */}
        {errorMessage ? (
          <View className="flex-row items-center bg-[#3D0015] rounded-lg px-3 py-2 mb-4 border border-[#FF5E7D33] gap-2">
            <Ionicons name="alert-circle-outline" size={14} color="#FF5E7D" />
            <Text className="text-[#FF5E7D] text-sm flex-1">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Login button */}
        <TouchableOpacity
          className={`rounded-xl py-4 flex-row items-center justify-center mt-1 bg-[#4A9EFF] ${
            loading ? "opacity-60" : "opacity-100"
          }`}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading && (
            <ActivityIndicator
              color="#fff"
              size={18}
              style={{ marginRight: 8 }}
            />
          )}
          <Text className="text-white text-base font-bold tracking-wide">
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-6 gap-3">
          <View className="flex-1 h-px bg-[#252C35]" />
          <Text className="text-[#3D4855] text-sm">or</Text>
          <View className="flex-1 h-px bg-[#252C35]" />
        </View>

        {/* Signup link */}
        <Pressable
          className="flex-row justify-center items-center"
          onPress={() => onNavigateToSignup?.()}
        >
          <Text className="text-[#5A6677] text-sm">
            Don't have an account?{" "}
          </Text>
          <Text className="text-[#4A9EFF] text-sm font-semibold">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginForm;
