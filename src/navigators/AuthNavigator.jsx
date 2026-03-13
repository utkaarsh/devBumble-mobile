import { createStackNavigator } from "@react-navigation/stack";
import Authentication from "../screens/Authentication";
import HomeScreen from "../screens/HomeScreen";
import { Image, Text, View } from "react-native";

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: "#fff" },
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#848484",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              shadowRadius: 10,
            }}
          />
        ),

        headerTitleAlign: "center",
        headerTitle: () => (
          <View className="flex-row items-center justify-around space-x-3">
            <Image
              source={require("../../assets/images/devBumble.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            <Text className="text-2xl text-white ml-3 font-bold">
              Dev Bumble
            </Text>
          </View>
        ),
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen name="login" component={Authentication} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
