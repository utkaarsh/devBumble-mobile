import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api/fetchFeed";

const useFeedData = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};

export default useFeedData;
