/**
 * Offline-Aware API Client
 * 
 * Wraps the API client to automatically queue changes when offline.
 * Provides the same interface as apiClient but with offline support.
 */

import { apiClient } from './api-client';
import { offlineQueue } from './offline-queue';

class OfflineApiClient {
  /**
   * GET requests are not queued (read-only)
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return apiClient.get<T>(url, params);
  }

  /**
   * POST requests are queued when offline
   */
  async post<T>(url: string, data?: unknown): Promise<T> {
    if (!offlineQueue.getOnlineStatus()) {
      // Queue for later sync
      offlineQueue.enqueue('POST', url, data);
      
      // Return a placeholder response
      // In a real app, you might want to generate optimistic IDs
      return Promise.resolve({} as T);
    }

    return apiClient.post<T>(url, data);
  }

  /**
   * PATCH requests are queued when offline
   */
  async patch<T>(url: string, data?: unknown): Promise<T> {
    if (!offlineQueue.getOnlineStatus()) {
      // Queue for later sync
      offlineQueue.enqueue('PATCH', url, data);
      
      // Return a placeholder response
      return Promise.resolve({} as T);
    }

    return apiClient.patch<T>(url, data);
  }

  /**
   * DELETE requests are queued when offline
   */
  async delete<T>(url: string): Promise<T> {
    if (!offlineQueue.getOnlineStatus()) {
      // Queue for later sync
      offlineQueue.enqueue('DELETE', url);
      
      // Return a placeholder response
      return Promise.resolve({} as T);
    }

    return apiClient.delete<T>(url);
  }
}

export const offlineApiClient = new OfflineApiClient();
