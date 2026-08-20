import React from "react";
import { View, Text, Pressable } from "react-native";
import Chips from "../Chips";
import {
  formatTime,
  renderJobDescription,
  splitByComma,
} from "../../utils/helpers";
import WebsiteButton from "./WebsiteButton";
import { CARD_HEIGHT } from "../../utils/constants";
import { ScrollView } from "react-native-gesture-handler";

const JobCard = ({ job, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress?.(job)}
      style={{ height: CARD_HEIGHT }}
      className="w-[400px]  mr-4 rounded-2xl bg-[#15191E] border border-gray-500 p-4"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 5 }}
        directionalLockEnabled
        overScrollMode="never" // Android: stops edge-glow from fighting the parent's horizontal fling
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Company + Job title */}
        <View className="mb-4">
          <View className="mt-5 flex-row items-center justify-between">
            <Text
              className="flex-1 mr-3 text-lg font-bold text-white"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {job.title}
            </Text>
            <Text className="text-xs text-gray-300">
              {formatTime(job.createdDate) || "yo"}
            </Text>
          </View>

          <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
            {job.companyName}
          </Text>
        </View>

        {/* Job information */}
        <View className="gap-3 mb-3">
          {Object.entries(job.placeholders || {}).map(([type, value]) => (
            <View key={type} className="flex-row">
              <Text className="w-24 text-sm font-medium capitalize text-gray-300">
                {type}
              </Text>

              <Text className="flex-1 text-sm text-gray-400" numberOfLines={2}>
                {value || "Not specified"}
              </Text>
            </View>
          ))}
        </View>

        {job?.applyRedirectUrl && (
          <View className="my-3">
            <WebsiteButton url={job.applyRedirectUrl} />
          </View>
        )}

        {/* Skills */}
        {job.tagsAndSkills && <Chips items={job?.tagsAndSkills} />}

        {job?.jobDescription && (
          <Text className="mt-4 text-xs text-gray-300">
            {renderJobDescription(job?.jobDescription)}
          </Text>
        )}
        {/* Footer */}
      </ScrollView>
    </Pressable>
  );
};

export default JobCard;
