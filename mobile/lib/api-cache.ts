/**
 * API Cache Manager (Mobile)
 * 
 * Implements caching strategy for frequently accessed data.
 * Follows Makana's performance requirements:
 * - Setups: cached indefinitely (rarely change)
 * - User profile: cached 5 minutes
 * - Active session: cached 1 minute
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class ApiCacheManager {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Cache durations (in milliseconds)
   */
  private readonly TTL = {
    SETUPS: Infinity, // Never expire (setups rarely change)
    USER_PROFILE: 5 * 60 * 1000, // 5 minutes
    ACTIVE_SESSION: 1 * 60 * 1000, // 1 minute
    ACTIVE_SETUP: 5 * 60 * 1000, // 5 minutes
    REDUCED_MODE: 1 * 60 * 1000, // 1 minute
    DEFAULT: 2 * 60 * 1000, // 2 minutes default
  };

  /**
   * Get cached data if valid
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache entry is still valid
    if (age < entry.ttl) {
      return entry.data;
    }

    // Cache expired, remove it
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cache entry with appropriate TTL
   */
  public set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.getTTLForKey(key),
    };

    this.cache.set(key, entry as CacheEntry<unknown>);
  }

  /**
   * Invalidate specific cache entry
   */
  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate cache entries matching pattern
   */
  public invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Get TTL for a specific cache key
   */
  private getTTLForKey(key: string): number {
    if (key.includes('/setups')) {
      return this.TTL.SETUPS;
    }
    if (key.includes('/user') || key.includes('/profile')) {
      return this.TTL.USER_PROFILE;
    }
    if (key.includes('/sessions/active')) {
      return this.TTL.ACTIVE_SESSION;
    }
    if (key.includes('/setups/active')) {
      return this.TTL.ACTIVE_SETUP;
    }
    if (key.includes('/reduced-mode')) {
      return this.TTL.REDUCED_MODE;
    }

    return this.TTL.DEFAULT;
  }

  /**
   * Get cache statistics (for debugging)
   */
  public getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const apiCache = new ApiCacheManager();

/**
 * Cache key generators for consistency
 */
export const CacheKeys = {
  setups: () => '/setups',
  activeSetup: (userId: string) => `/setups/active/${userId}`,
  userProfile: (userId: string) => `/user/${userId}`,
  activeSession: (userId: string) => `/sessions/active/${userId}`,
  reducedMode: (userId: string) => `/reduced-mode/${userId}`,
  dailyCheck: (userId: string, date: string) => `/daily-check/${userId}/${date}`,
  weeklyCheck: (userId: string, weekStart: string) => `/weekly-check/${userId}/${weekStart}`,
} as const;

