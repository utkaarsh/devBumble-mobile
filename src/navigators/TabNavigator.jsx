import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useState } from "react";
import FeedIcon from "../svg/FeedIcon";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import { HomeNavigator } from "./HomeNavigator";
import { SearchNavigator } from "./SearchNavigator";
import { ChatNavigator } from "./ChatNavigator";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { deleteToken } from "../auth/authTokenStorage";
import AuthContext from "../auth/context";
import Profile from "../screens/Profile";
import { useNavigation } from "@react-navigation/native";
import api from "../utils/api";

const HeaderMenu = () => {
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  // ✅ ACTIONS
  const handleLogout = async () => {
    try {
      await api.post("/logout"); // token auto attached via interceptor
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      await deleteToken();
      setUser(null);
    }
  };

  // ✅ MENU CONFIG (clean + scalable)
  const MENU_ITEMS = [
    {
      label: "Profile",
      icon: "person-outline",
      action: () => navigation.navigate("Profile"),
    },
    // {
    //   label: "Settings",
    //   icon: "settings-outline",
    //   action: () => navigation.navigate("Settings"),
    // },
    {
      label: "Matches",
      icon: "heart-outline",
      action: () =>
        navigation.navigate("Feed", {
          screen: "Matches",
          params: {
            listType: "matches",
            apiUrl: "/user/connections",
          },
        }),
    },
    {
      label: "Requests Recieved",
      icon: "people-outline",
      action: () =>
        navigation.navigate("Feed", {
          screen: "Requests",
          params: {
            listType: "requests",
            apiUrl: "/user/requests/recieved",
          },
        }),
    },
    {
      label: "Requests Sent",
      icon: "people-outline",
      action: () =>
        navigation.navigate("Feed", {
          screen: "Requests",
          params: {
            listType: "requests",
            apiUrl: "/user/requests/sent",
          },
        }),
    },
    {
      label: "Logout",
      icon: "log-out-outline",
      action: handleLogout,
      danger: true,
    },
  ];

  // ✅ HANDLE CLICK
  const handlePress = async (item) => {
    setVisible(false);
    await item.action?.();
  };

  // ✅ STYLES (moved out = cleaner + performant)
  const styles = {
    dropdown: {
      position: "absolute",
      top: 70,
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
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 13,
      paddingHorizontal: 16,
      gap: 12,
    },
    border: {
      borderBottomWidth: 1,
      borderBottomColor: "#252C35",
    },
    text: {
      color: "#EFF2F5",
      fontSize: 14,
      fontWeight: "500",
    },
  };
  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity onPress={() => setVisible(true)} hitSlop={10}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.dropdown}
          >
            {MENU_ITEMS.map((item, index) => {
              const isDanger = item.danger;

              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => handlePress(item)}
                  style={[
                    styles.item,
                    index !== MENU_ITEMS.length - 1 && styles.border,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={isDanger ? "#FF5E7D" : "#8695A4"}
                  />
                  <Text style={[styles.text, isDanger && { color: "#FF5E7D" }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export const TabNavigator = () => {
  const { user } = useContext(AuthContext);
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
          <View className="flex-row mt-2 items-center justify-between w-full space-x-3">
            {/* <View /> */}
            <View className="flex-row items-center justify-around space-x-3">
              {/* <Image
                source={require("../../assets/images/devBumble.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              /> */}
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
        component={HomeNavigator}
        options={{ tabBarIcon: ({ color }) => <FeedIcon color={color} /> }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <View className="w-8 h-8 overflow-hidden bg-gray-500 rounded-full  text-white flex items-center justify-center">
              {user?.photoUrl ? (
                <Image
                  source={{ uri: user?.photoUrl }}
                  className="w-full h-auto"
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name="person" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
