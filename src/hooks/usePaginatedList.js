import { useEffect, useState } from "react";
import api from "../utils/api";

export const usePaginatedList = (url) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber = 1, isRefresh = false) => {
    // ✅ Guard: don't fetch if url is missing
    if (!url) return;

    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get(`${url}?page=${pageNumber}`);
      const newData = res.data?.data || [];

      setData((prev) => (isRefresh ? newData : [...prev, ...newData]));
      setHasMore(res.data?.hasMore ?? false);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setHasMore(false); // ✅ Stop retrying on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchData(1);
  }, [url]);

  const loadMore = () => {
    if (!loading && !refreshing && hasMore) {
      // ✅ also check !refreshing
      fetchData(page + 1);
    }
  };

  const refresh = () => fetchData(1, true);

  return { data, loading, refreshing, loadMore, refresh };
};
