/**
 * Offline Queue Manager
 * 
 * Handles queuing of data modifications when offline and automatic sync when online.
 * Uses localStorage for persistence across app restarts.
 */

export interface QueuedChange {
  id: string;
  timestamp: number;
  method: 'POST' | 'PATCH' | 'DELETE';
  url: string;
  data?: unknown;
  retryCount: number;
}

const QUEUE_KEY = 'makana_offline_queue';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds base delay

class OfflineQueueManager {
  private queue: QueuedChange[] = [];
  private isSyncing = false;
  private isOnline = true;

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
  }

  /**
   * Load queued changes from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Setup online/offline event listeners
   */
  private setupOnlineListener(): void {
    if (typeof window === 'undefined') return;

    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      console.log('Network connection restored');
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      console.log('Network connection lost');
      this.isOnline = false;
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
  public enqueue(method: 'POST' | 'PATCH' | 'DELETE', url: string, data?: unknown): string {
    const change: QueuedChange = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      method,
      url,
      data,
      retryCount: 0,
    };

    this.queue.push(change);
    this.saveQueue();

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
    this.saveQueue();
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
  public clearQueue(): void {
    this.queue = [];
    this.saveQueue();
    console.log('Offline queue cleared');
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
