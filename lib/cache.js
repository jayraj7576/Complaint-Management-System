/**
 * lib/cache.js
 * Simple in-memory cache utility for server-side use.
 * Avoids redundant DB queries for frequently accessed, rarely changing data.
 *
 * Usage:
 *   import { getCache, setCache, invalidateCache } from '@/lib/cache';
 *   const cached = getCache('key');
 *   setCache('key', data, 60);    // TTL = 60 seconds
 *   invalidateCache('key');
 */

const store = new Map();

/**
 * Get a value from cache.
 * Returns null if key doesn't exist or has expired.
 */
export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Store a value in cache.
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds - Time to live in seconds (default: 60)
 */
export function setCache(key, value, ttlSeconds = 60) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Remove a specific key from cache.
 */
export function invalidateCache(key) {
  store.delete(key);
}

/**
 * Clear all cached entries.
 */
export function clearAllCache() {
  store.clear();
}

/**
 * Wrap an async data-fetching function with caching.
 * If the key is cached and still valid, returns the cached value.
 * Otherwise, calls the fetcher, caches the result, and returns it.
 *
 * Example:
 *   const data = await withCache('stats', () => fetchStats(), 120);
 */
export async function withCache(key, fetcher, ttlSeconds = 60) {
  const cached = getCache(key);
  if (cached !== null) return cached;
  const value = await fetcher();
  setCache(key, value, ttlSeconds);
  return value;
}
