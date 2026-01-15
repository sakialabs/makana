/**
 * Session History Page
 * 
 * View recent sessions with dates, durations, and next steps.
 * No metrics, no streaks, just records.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

interface Session {
  id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  next_step: string | null;
  status: 'completed' | 'abandoned';
}

export default function SessionHistoryPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient.get<Session[]>('/sessions/recent', { limit: 10 });
        setSessions(data || []);
        setLoading(false);
      } catch (err: any) {
        // Empty history is not an error - just show empty state
        setSessions([]);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
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
      <Container>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
            Session History
          </h1>
          <p className="text-[#5f5f5f]">
            Recent sessions
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <p className="text-[#5f5f5f] mb-6">
              No sessions yet. Begin when ready.
            </p>
            <Button onClick={() => router.push('/dashboard/session')}>
              Start Session
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#1f1f1f]">
                      {new Date(session.start_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <p className="text-sm text-[#5f5f5f] mt-1">
                      {new Date(session.start_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-base font-medium text-[#1f1f1f]">
                    {session.duration_minutes} min
                  </span>
                </div>
                {session.next_step && (
                  <div className="pt-4 border-t border-[#d6d2cb] dark:border-[#4A4A4A]">
                    <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] mb-1">Next step</p>
                    <p className="text-base text-[#1f1f1f] dark:text-[#eaeaea]">
                      {session.next_step}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
