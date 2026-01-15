/**
 * Sync Status Indicator
 * 
 * Displays offline/syncing status with calm, non-intrusive messaging.
 */

'use client';

import { useOfflineSync } from '@/hooks/useOfflineSync';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, Check } from 'lucide-react';

export function SyncStatus() {
  const { isOnline, isSyncing, queueLength } = useOfflineSync();

  // Don't show anything if online and nothing to sync
  if (isOnline && !isSyncing && queueLength === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed top-20 right-4 z-40 max-w-xs"
      >
        <div className="bg-[#ece9e4] dark:bg-[#1A1A1A] border border-[#d6d2cb] dark:border-[#4A4A4A] rounded-lg px-4 py-3 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3">
            {/* Icon */}
            {!isOnline && (
              <WifiOff size={20} className="text-[#5f5f5f] dark:text-[#9a9a9a]" />
            )}
            {isOnline && isSyncing && (
              <RefreshCw size={20} className="text-[#2B2B2B] animate-spin" />
            )}
            {isOnline && !isSyncing && queueLength > 0 && (
              <Check size={20} className="text-[#5E8C6A]" />
            )}

            {/* Message */}
            <div className="flex-1">
              {!isOnline && (
                <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
                  Offline. Changes will sync when connected.
                </p>
              )}
              {isOnline && isSyncing && (
                <p className="text-sm text-[#2B2B2B]">
                  Syncing {queueLength} {queueLength === 1 ? 'change' : 'changes'}...
                </p>
              )}
              {isOnline && !isSyncing && queueLength > 0 && (
                <p className="text-sm text-[#5E8C6A]">
                  Synced successfully
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
