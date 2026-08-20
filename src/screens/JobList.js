import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import JobCarousel from "../components/job/JobCarousel";
import { jobData } from "../utils/jobData";
import axios from "axios";
import { path } from "../utils/path";

const JobList = () => {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchJobResponse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${path}/recent-jobs`);
      setJobsList(res.data?.data);
    } catch (error) {
      setLoading(false);
      console.error("Error in fetching job response: ", error.message || error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchJobResponse();
  }, []);

  return (
    <View style={styles.container} className="gap-3 bg-black my-20">
      <Text className="p-4 text-white text-lg mx-4 font-bold">Jobs </Text>
      {jobsList?.length > 0 && (
        <JobCarousel
          jobs={jobsList}
          onJobPress={(job) => {
            console.log("Selected job:", job._id ?? 12);
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   alignItems: "center",
    //   justifyContent: "center",
  },
  text: {
    color: "#000",
  },
  boldText: {
    color: "#000",
    fontFamily: "Gilroy-Bold",
  },
  mediumText: {
    color: "#000",
    fontFamily: "Gilroy-Medium",
  },
  semiboldText: {
    color: "#000",
    fontFamily: "Gilroy-SemiBold",
  },
});

export default JobList;
