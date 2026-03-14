import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { path } from "../utils/path";

const DEFAULT_LIMIT = 10;

const fetchFeed = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `${path}/user/feed/?page=${pageParam}&limit=${DEFAULT_LIMIT}`,
  );
  return res.data;
};

const useFeedData = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // ✅ If last page returned less than limit, we've hit the end
      if (lastPage.data?.length < DEFAULT_LIMIT) return undefined;
      return allPages?.length + 1; // next page number
    },
  });
};

export default useFeedData;
