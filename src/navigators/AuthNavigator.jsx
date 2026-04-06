import { createStackNavigator } from "@react-navigation/stack";
import Authentication from "../screens/Authentication";
import HomeScreen from "../screens/HomeScreen";
import { Image, Text, View } from "react-native";
import SignupForm from "../components/SignupForm";

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        sceneStyle: { backgroundColor: "#1D232A" },
        headerStyle: { backgroundColor: "black" },
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#15191E",
              // borderBottomLeftRadius: 20,
              // borderBottomRightRadius: 20,
              overflow: "hidden",
            }}
          />
        ),
        headerTitleAlign: "center",
        headerTitle: () => (
          <View className="flex-row items-center justify-start space-x-3">
            {/* <Image
              source={require("../../assets/images/devBumble.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            /> */}
            <Text className="text-4xl text-[#A6ADBB] uppercase ml-3 font-bold">
              Dev Bumble
            </Text>
          </View>
        ),
        headerShadowVisible: false,
        tabBarStyle: { position: "absolute" },
      }}
    >
      <Stack.Screen name="login" component={Authentication} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Signup" component={SignupForm} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
