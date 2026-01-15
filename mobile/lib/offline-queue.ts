/**
 * Offline Queue Manager (Mobile)
 * 
 * Handles queuing of data modifications when offline and automatic sync when online.
 * Uses AsyncStorage for persistence across app restarts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface QueuedChange {
  id: string;
  timestamp: number;
  method: 'POST' | 'PATCH' | 'DELETE';
  url: string;
  data?: unknown;
  retryCount: number;
}

const QUEUE_KEY = '@makana_offline_queue';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds base delay

class OfflineQueueManager {
  private queue: QueuedChange[] = [];
  private isSyncing = false;
  private isOnline = true;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the queue manager
   */
  private async initialize(): Promise<void> {
    await this.loadQueue();
    this.setupNetworkListener();
  }

  /**
   * Load queued changes from AsyncStorage
   */
  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to AsyncStorage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Setup network state listener
   */
  private setupNetworkListener(): void {
    this.unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        console.log('Network connection restored');
        this.syncQueue();
      } else if (!this.isOnline) {
        console.log('Network connection lost');
      }
    });
  }

  /**
   * Check if currently online
   */
  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Add a change to the queue
   */
  public async enqueue(method: 'POST' | 'PATCH' | 'DELETE', url: string, data?: unknown): Promise<string> {
    const change: QueuedChange = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      method,
      url,
      data,
      retryCount: 0,
    };

    this.queue.push(change);
    await this.saveQueue();

    console.log(`Queued ${method} ${url} (offline)`);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncQueue();
    }

    return change.id;
  }

  /**
   * Get current queue length
   */
  public getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Get sync status
   */
  public isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Sync all queued changes to server
   */
  public async syncQueue(): Promise<void> {
    if (this.isSyncing || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.isSyncing = true;
    console.log(`Starting sync of ${this.queue.length} queued changes`);

    const failedChanges: QueuedChange[] = [];

    for (const change of this.queue) {
      try {
        await this.syncChange(change);
        console.log(`Synced ${change.method} ${change.url}`);
      } catch (error) {
        console.error(`Failed to sync ${change.method} ${change.url}:`, error);
        
        change.retryCount++;
        
        if (change.retryCount < MAX_RETRIES) {
          failedChanges.push(change);
        } else {
          console.error(`Max retries reached for ${change.method} ${change.url}, dropping`);
        }
      }

      // Small delay between requests to avoid overwhelming server
      await this.delay(100);
    }

    this.queue = failedChanges;
    await this.saveQueue();
    this.isSyncing = false;

    if (failedChanges.length > 0) {
      console.log(`${failedChanges.length} changes failed, will retry`);
      // Schedule retry with exponential backoff
      setTimeout(() => this.syncQueue(), RETRY_DELAY_MS * Math.pow(2, failedChanges[0].retryCount));
    } else {
      console.log('All queued changes synced successfully');
    }
  }

  /**
   * Sync a single change to the server
   */
  private async syncChange(change: QueuedChange): Promise<void> {
    const { apiClient } = await import('./api-client');

    switch (change.method) {
      case 'POST':
        await apiClient.post(change.url, change.data);
        break;
      case 'PATCH':
        await apiClient.patch(change.url, change.data);
        break;
      case 'DELETE':
        await apiClient.delete(change.url);
        break;
    }
  }

  /**
   * Clear all queued changes (use with caution)
   */
  public async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
    console.log('Offline queue cleared');
  }

  /**
   * Cleanup listeners
   */
  public cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const offlineQueue = new OfflineQueueManager();
