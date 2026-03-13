import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useState } from "react";
import FeedIcon from "../svg/FeedIcon";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Authentication from "../screens/Authentication";
import HomeScreen from "../screens/HomeScreen";
import { HomeNavigator } from "./HomeNavigator";
import StarIcon from "../svg/StarIcon";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import TinderPage from "../screens/TinderPage";
import axios from "axios";
import { path } from "../utils/path";
import { deleteToken, getToken } from "../auth/authTokenStorage";
import AuthContext from "../auth/context";
import Profile from "../screens/Profile";

const HeaderMenu = () => {
  const { setUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const MENU_ITEMS = [
    { label: "Profile", icon: "person-outline" },
    { label: "Settings", icon: "settings-outline" },
    { label: "Matches", icon: "heart-outline" },
    { label: "Logout", icon: "log-out-outline", onClick: handleLogout },
  ];

  const handleLogout = async () => {
    try {
      const token = await getToken(); // ✅ token fetched correctly
      await axios.post(
        `${path}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      await deleteToken(); // ✅ clears token + user from context regardless of API result
      setUser(null);
    }
  };

  const handlePress = (item) => {
    setVisible(false);
    if (item.label === "Logout") handleLogout();
    // add other navigation cases here
  };

  return (
    <View>
      {/* Hamburger trigger */}
      <TouchableOpacity onPress={() => setVisible(true)} hitSlop={10}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Dropdown modal */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        {/* Backdrop — tap outside to close */}
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          {/* Dropdown card */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 70, // just below the header
              right: 16,
              backgroundColor: "#1D232A",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#2F3740",
              minWidth: 180,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 10,
              overflow: "hidden",
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  handlePress(item);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                  borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: "#252C35",
                  gap: 12,
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.label === "Logout" ? "#FF5E7D" : "#8695A4"}
                />
                <Text
                  style={{
                    color: item.label === "Logout" ? "#FF5E7D" : "#EFF2F5",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        sceneStyle: { backgroundColor: "#1D232A" },
        headerStyle: { backgroundColor: "transparent" },
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#15191E",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              overflow: "hidden",
            }}
          />
        ),
        headerTitleAlign: "center",
        headerTitle: () => (
          <View className="flex-row items-center justify-between w-full space-x-3">
            <View />
            <View className="flex-row items-center justify-around space-x-3">
              <Image
                source={require("../../assets/images/devBumble.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <Text className="text-4xl text-[#A6ADBB] uppercase ml-3 font-bold">
                Dev Bumble
              </Text>
            </View>
            <HeaderMenu />
          </View>
        ),
        headerShadowVisible: false,
        tabBarStyle: { position: "absolute" },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={TinderPage}
        options={{ tabBarIcon: ({ color }) => <FeedIcon color={color} /> }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Auth"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
