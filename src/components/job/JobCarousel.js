import React from "react";
import { View } from "react-native";
import JobCard from "./JobCard";
import { FlatList } from "react-native-gesture-handler";

const JobCarousel = ({ jobs, onJobPress }) => {
  return (
    <FlatList
      data={jobs}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, idx) =>
        item.jobId != null ? String(item.jobId) : String(idx)
      }
      renderItem={({ item }) => <JobCard job={item} onPress={onJobPress} />}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      initialNumToRender={4}
      windowSize={5}
      decelerationRate="fast"
      removeClippedSubviews={false} // keep this false — true is a known cause of blank/glitchy cards in nested-scroll + horizontal FlatList on Android
    />
  );
};

export default JobCarousel;
