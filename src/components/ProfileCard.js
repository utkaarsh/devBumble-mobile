import React from "react";
import { ScrollView, Image, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import { appColors } from "../utils/styles";
import TextHead from "./TextHead";
import H6 from "./H6";
import H1 from "./H1";
import Chips from "./Chips";
import { formatDate } from "../utils/utility";

const ViewProfile = ({ data }) => {
  const user = data;

  const sections = [
    {
      iconName: "person-outline",
      label: "About",
      value: user?.about ?? "No information available.",
    },
    {
      icon: <Feather name="briefcase" size={22} color={appColors.accent} />,
      label: "Experience",
      value: user?.experience ?? "No experience information available.",
    },
    {
      iconName: "location-on",
      label: "Location",
      value: user?.location
        ? `${user.location.coordinates[1]}, ${user.location.coordinates[0]}`
        : "No location information available.",
    },
    {
      iconName: "calendar-today",
      label: "Member Since",
      value: user?.createdAt
        ? formatDate(user.createdAt)
        : "No membership information available.",
    },
  ];

  return (
    <ScrollView className="p-2">
      {/* PROFILE HEADER */}
      <View className="bg-[#15191E] p-4 rounded-lg mt-10 mx-2 flex-row items-start ">
        <View className="w-24 h-24 overflow-hidden bg-gray-500 rounded-full mr-4 items-center justify-center">
          {user?.photoUrl ? (
            <Image
              source={{ uri: user.photoUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle-sharp" size={74} color="white" />
          )}
        </View>

        <View className="flex-1 gap-2">
          <Text className="text-white text-lg font-bold">
            {user?.firstName} {user?.lastName}
          </Text>

          <Text className="text-gray-400 text-base">{user?.emailId}</Text>

          <View className="flex-row gap-2">
            <Text className="text-gray-400 text-base">{user?.gender},</Text>
            <Text className="text-gray-400 text-base">{user?.age}</Text>
          </View>
        </View>
      </View>

      {/* ABOUT + EXPERIENCE + LOCATION + MEMBER SINCE */}
      <Card>
        {sections.map((section, index) => (
          <View key={index} className="mb-3 gap-2">
            <TextHead
              icon={section.icon}
              iconName={section.iconName}
              label={section.label}
              className="mt-2"
            />
            <H6>{section.value}</H6>
          </View>
        ))}
      </Card>

      {/* SKILLS */}
      <Card>
        <H1>Technical Skills</H1>
        <Chips items={user?.skills || []} />
      </Card>

      {/* INTERESTS */}
      <Card>
        <H1>Interests</H1>
        <Chips items={user?.interests || []} />
      </Card>
    </ScrollView>
  );
};

export default ViewProfile;
