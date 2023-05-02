// utils/cache.ts

type CacheData<T> = {
  data: T;
  timestamp: number;
};

const cache: Record<string, CacheData<any>> = {};

const getCacheData = <T>(url: string, cacheTime: number): CacheData<T> | null => {
  console.log(cache[url], Date.now() - cache[url].timestamp, cacheTime);
  if (cache[url] && Date.now() - cache[url].timestamp <= cacheTime) {
    return cache[url];
  }
  return null;
};

const setCacheData = <T>(url: string, data: T) => {
  cache[url] = {
    data,
    timestamp: Date.now(),
  };
};

export { getCacheData, setCacheData };
