import React, { useContext } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AuthContext from "../auth/context";

const Header = () => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "red",
    },
    text: {
      color: "#000",
      fontSize: 16,
    },
    screen: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      padding: 0,
      margin: 0,
    },
  });

  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <SafeAreaView style={styles.screen} className="">
        <View className="w-full flex items-center justify-center py-4 bg-yellow-200 shadow border border-red-500">
          <Image
            source={require("../../assets/images/devBumble.png")} // Place your logo in assets folder
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} className="">
      <View style={styles.container}>
        <Text style={styles.text} className="">
          Header{" "}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;
