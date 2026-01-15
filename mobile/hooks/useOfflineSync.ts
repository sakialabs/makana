/**
 * useOfflineSync Hook (Mobile)
 * 
 * Provides offline status and sync state for UI components.
 * Automatically syncs when connectivity is restored.
 */

import { useState, useEffect } from 'react';
import { offlineQueue } from '../lib/offline-queue';

export interface OfflineSyncState {
  isOnline: boolean;
  isSyncing: boolean;
  queueLength: number;
}

export function useOfflineSync() {
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: offlineQueue.getOnlineStatus(),
    isSyncing: offlineQueue.isSyncInProgress(),
    queueLength: offlineQueue.getQueueLength(),
  });

  useEffect(() => {
    // Update state periodically
    const interval = setInterval(() => {
      setState({
        isOnline: offlineQueue.getOnlineStatus(),
        isSyncing: offlineQueue.isSyncInProgress(),
        queueLength: offlineQueue.getQueueLength(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return state;
}
