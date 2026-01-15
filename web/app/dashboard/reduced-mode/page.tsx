/**
 * Reduced Mode Page
 * 
 * Toggle reduced mode for capacity-aware practice.
 * Calm explanation and easy toggling without restrictions.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

interface ReducedModeState {
  is_active: boolean;
  activated_at: string | null;
  deactivated_at: string | null;
}

export default function ReducedModePage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingState, setFetchingState] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reducedModeState, setReducedModeState] = useState<ReducedModeState | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchReducedModeState = async () => {
      try {
        const state = await apiClient.get<ReducedModeState>('/reduced-mode/status');
        setReducedModeState(state);
        setFetchingState(false);
      } catch (err: any) {
        setError(err.message || 'Unable to load state. Try again in a moment.');
        setFetchingState(false);
      }
    };

    if (isAuthenticated) {
      fetchReducedModeState();
    }
  }, [isAuthenticated]);

  const handleToggle = async () => {
    if (!reducedModeState) return;

    setError(null);
    setLoading(true);

    try {
      const endpoint = reducedModeState.is_active 
        ? '/reduced-mode/deactivate' 
        : '/reduced-mode/activate';
      
      const newState = await apiClient.post<ReducedModeState>(endpoint);
      setReducedModeState(newState);
    } catch (err: any) {
      setError(err.message || 'Unable to update. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingState) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
      <Container size="sm">
        <Card>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Reduced Mode
            </h1>
            <p className="text-[#5f5f5f]">
              Adjust practice for low-capacity periods.
            </p>
          </div>

          {reducedModeState && (
            <div className="mb-6 p-4 bg-[#f7f5f2] dark:bg-[#1A1A1A] rounded-md border border-[#d6d2cb] dark:border-[#4A4A4A] transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">Status</span>
                <span className={`text-base font-medium ${reducedModeState.is_active ? 'text-[#2B2B2B]' : 'text-[#1f1f1f] dark:text-[#eaeaea]'}`}>
                  {reducedModeState.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="text-sm text-[#5f5f5f] space-y-2">
                <p>
                  Reduced mode adjusts session duration to support continuity during difficult periods.
                </p>
                <p>
                  Sessions become shorter. Prompts stay simple. Practice continues.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-[#a5544a]/10 border border-[#a5544a]/20 rounded-md">
              <p className="text-sm text-[#a5544a]">{error}</p>
            </div>
          )}

          <Button 
            onClick={handleToggle} 
            fullWidth 
            disabled={loading}
            variant={reducedModeState?.is_active ? 'secondary' : 'primary'}
          >
            {loading 
              ? 'Updating...' 
              : reducedModeState?.is_active 
                ? 'Deactivate Reduced Mode' 
                : 'Activate Reduced Mode'}
          </Button>
        </Card>
      </Container>
    </div>
  );
}
