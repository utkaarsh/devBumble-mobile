import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../utils/api";

const DEFAULT_LIMIT = 10;

const fetchFeed = async ({ pageParam = 1 }) => {
  console.log("Hitting");
  const res = await api.get(
    `/user/feed/?page=${pageParam}&limit=${DEFAULT_LIMIT}`,
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
