'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Setup {
  id: string;
  name: string;
  default_session_duration: number;
  emphasis: string;
}

export function ActiveSetupBadge() {
  const [setup, setSetup] = useState<Setup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveSetup();
  }, []);

  const loadActiveSetup = async () => {
    try {
      const data = await apiClient.get<Setup>('/setups/active');
      setSetup(data);
    } catch (err) {
      // Silently fail - not critical to show
      // User might not have an active setup yet
      console.debug('No active setup found:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !setup) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-soft-stone rounded-full text-sm text-slate">
      <span className="w-2 h-2 bg-deep-olive rounded-full" aria-hidden="true" />
      <span>{setup.name}</span>
    </div>
  );
}
