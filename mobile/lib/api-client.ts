/**
 * API Client for Makana Backend (Mobile)
 * 
 * Handles HTTP requests with authentication, error handling, caching, and calm messaging.
 * Implements performance optimizations:
 * - Caching for frequently accessed data
 * - Request deduplication
 * - Automatic cache invalidation
 * Mirrors the web client implementation.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { apiCache, CacheKeys } from './api-cache';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface RequestOptions {
  skipCache?: boolean;
  cacheTTL?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Transform error to calm message
        const apiError: ApiError = {
          code: error.response?.data?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.message || 'Unable to complete request. Try again in a moment.',
          details: error.response?.data?.details,
        };
        return Promise.reject(apiError);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  async get<T>(url: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    const cacheKey = this.getCacheKey('GET', url, params);

    // Check cache first (unless skipCache is true)
    if (!options?.skipCache) {
      const cached = apiCache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Check for pending request (deduplication)
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) {
      return pending as Promise<T>;
    }

    // Make request
    const request = this.client.get<T>(url, { params }).then(response => {
      const data = response.data;
      
      // Cache the response
      if (!options?.skipCache) {
        apiCache.set(cacheKey, data, options?.cacheTTL);
      }
      
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
      
      return data;
    }).catch(error => {
      // Remove from pending requests on error
      this.pendingRequests.delete(cacheKey);
      throw error;
    });

    this.pendingRequests.set(cacheKey, request);
    return request;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response.data;
  }

  /**
   * Generate cache key from request parameters
   */
  private getCacheKey(method: string, url: string, params?: Record<string, unknown>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${method}:${url}${paramString}`;
  }

  /**
   * Invalidate cache entries related to a URL
   */
  private invalidateRelatedCache(url: string): void {
    // Invalidate specific patterns based on URL
    if (url.includes('/sessions')) {
      apiCache.invalidatePattern(/\/sessions/);
    }
    if (url.includes('/daily-check')) {
      apiCache.invalidatePattern(/\/daily-check/);
    }
    if (url.includes('/weekly-check')) {
      apiCache.invalidatePattern(/\/weekly-check/);
    }
    if (url.includes('/setups/activate')) {
      apiCache.invalidatePattern(/\/setups\/active/);
    }
    if (url.includes('/reduced-mode')) {
      apiCache.invalidatePattern(/\/reduced-mode/);
    }
  }

  /**
   * Clear all cache (useful for logout)
   */
  public clearCache(): void {
    apiCache.clear();
  }
}

export const apiClient = new ApiClient();
