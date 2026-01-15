/**
 * Active Session Page
 * 
 * Minimal interface during active session.
 * Timer, pause/stop actions only.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

export default function ActiveSessionPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fetchingSession, setFetchingSession] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const session = await apiClient.get<{
          id: string;
          start_time: string;
          duration_minutes: number;
          status: string;
        }>('/sessions/active');

        if (!session) {
          // No active session - redirect to session start page
          router.push('/dashboard/session');
          return;
        }

        setSessionId(session.id);

        // Calculate time remaining
        const startTime = new Date(session.start_time).getTime();
        const durationMs = session.duration_minutes * 60 * 1000;
        const endTime = startTime + durationMs;
        const now = Date.now();
        const remainingMs = Math.max(0, endTime - now);
        const remainingSeconds = Math.floor(remainingMs / 1000);

        setTimeRemaining(remainingSeconds);
        setFetchingSession(false);
      } catch (err: any) {
        // No active session - redirect
        router.push('/dashboard/session');
      }
    };

    if (isAuthenticated) {
      fetchActiveSession();
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Countdown timer
    if (timeRemaining <= 0 || fetchingSession) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, fetchingSession]);

  const handleStop = async () => {
    setLoading(true);
    // Navigate to braking screen
    router.push('/dashboard/session/braking');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading || fetchingSession) {
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
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center py-16">
      <Container size="sm">
        <Card className="text-center">
          <div className="mb-12">
            <p className="text-6xl font-semibold text-[#1f1f1f] mb-4">
              {formatTime(timeRemaining)}
            </p>
            <p className="text-sm text-[#5f5f5f]">
              Time remaining
            </p>
          </div>

          <Button onClick={handleStop} fullWidth disabled={loading} variant="secondary">
            {loading ? 'Stopping...' : 'Stop Session'}
          </Button>
        </Card>
      </Container>
    </div>
  );
}
