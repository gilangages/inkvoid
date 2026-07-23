import { useState, useEffect, useCallback } from "react";

const CACHE_PREFIX = "swr_cache_";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export function useSWR1DayTTL<T>(
  key: string | null,
  fetcher: () => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeFetch = useCallback(async () => {
    if (!key) return;

    try {
      setIsLoading(true);
      const result = await fetcher();
      setData(result);
      setError(null);

      // Save to localStorage
      const cachePayload: CacheData<T> = {
        data: result,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cachePayload));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher]);

  useEffect(() => {
    if (!key) return;

    // Try reading from cache
    const cachedString = localStorage.getItem(CACHE_PREFIX + key);
    if (cachedString) {
      try {
        const cachedPayload: CacheData<T> = JSON.parse(cachedString);
        const age = Date.now() - cachedPayload.timestamp;

        if (age < ONE_DAY_MS) {
          // Cache is still fresh (< 24h)
          setData(cachedPayload.data);
          // 1-Day TTL Strategy DOES NOT background fetch. We stop here.
          return;
        } else {
          // Cache is stale, delete it
          localStorage.removeItem(CACHE_PREFIX + key);
        }
      } catch (err) {
        console.warn("SWR Cache Error:", err);
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    }

    // No valid cache, perform fetch
    executeFetch();
  }, [key, executeFetch]);

  return { data, error, isLoading, mutate: executeFetch };
}

