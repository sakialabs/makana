/**
 * Ignition Page
 * 
 * Start a focused session with minimal friction.
 * One primary action: Begin.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

export default function SessionPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [reducedModeActive, setReducedModeActive] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        // Check for active session
        const session = await apiClient.get<{
          id: string;
          start_time: string;
          duration_minutes: number;
          status: string;
        }>('/sessions/active');
        
        if (session) {
          setActiveSession(session);
          // Will redirect via the activeSession check below
        }
        
        // Check reduced mode status
        const reducedModeData = await apiClient.get<{ is_active: boolean }>('/reduced-mode/status');
        setReducedModeActive(reducedModeData.is_active);
        
        setCheckingSession(false);
      } catch (err: any) {
        // No active session is expected - not an error
        setCheckingSession(false);
      }
    };

    if (isAuthenticated) {
      checkActiveSession();
    }
  }, [isAuthenticated]);

  const handleStartSession = async () => {
    setError(null);
    setLoading(true);

    try {
      // Get the default "Calm" setup ID - in production this would come from user preferences
      // For now, we'll use a hardcoded setup_id that matches the backend preset
      await apiClient.post('/sessions', { 
        setup_id: 'calm' 
      });

      // Redirect to active session
      router.push('/dashboard/session/active');
    } catch (err: any) {
      if (err.code === 'CONCURRENT_SESSION') {
        setError('Unable to start right now. Try again in a moment.');
      } else {
        setError(err.message || 'Unable to start. Try again in a moment.');
      }
      setLoading(false);
    }
  };

  if (authLoading || checkingSession) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (activeSession) {
    router.push('/dashboard/session/active');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
      <Container size="sm">
        <Card>
          <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
            Ignition
          </h1>
          <p className="text-[#5f5f5f] mb-8">
            Begin when ready.
          </p>

          <div className="mb-6 p-4 bg-[#f7f5f2] dark:bg-[#1A1A1A] rounded-md border border-[#d6d2cb] dark:border-[#4A4A4A] transition-colors duration-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">Setup</span>
              <span className="text-base font-medium text-[#1f1f1f]">Calm</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-[#5f5f5f]">Duration</span>
              <span className="text-base font-medium text-[#1f1f1f]">
                {reducedModeActive ? '15 minutes' : '25 minutes'}
              </span>
            </div>
            {reducedModeActive && (
              <div className="mt-3 pt-3 border-t border-[#d6d2cb] dark:border-[#4A4A4A]">
                <span className="text-sm text-[#2B2B2B]">Reduced mode active</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#a5544a]/10 border border-[#a5544a]/20 rounded-md">
              <p className="text-sm text-[#a5544a]">{error}</p>
            </div>
          )}

          <Button onClick={handleStartSession} fullWidth disabled={loading}>
            {loading ? 'Starting...' : 'Begin Session'}
          </Button>
        </Card>
      </Container>
    </div>
  );
}
