/**
 * Daily Check History Page
 * 
 * View past check-ins in reverse chronological order.
 * Calm, non-judgmental display with generous spacing.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

interface DailyCheck {
  id: string;
  check_date: string;
  responses: {
    energy_level: string;
    intention?: string;
  };
  completed_at: string;
}

export default function DailyCheckHistoryPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [checks, setChecks] = useState<DailyCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient.get<DailyCheck[]>('/daily-check/history', { limit: 10 });
        setChecks(data || []);
        setLoading(false);
      } catch (err: any) {
        // Empty history is not an error - just show empty state
        setChecks([]);
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
            Check-In History
          </h1>
          <p className="text-[#5f5f5f]">
            Past daily check-ins
          </p>
        </div>

        {checks.length === 0 ? (
          <Card>
            <p className="text-[#5f5f5f] mb-6">
              No check-ins yet. Start with today's check-in.
            </p>
            <Button onClick={() => router.push('/dashboard/daily-check')}>
              Daily Check
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {checks.map((check) => (
              <Card key={check.id}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-[#1f1f1f]">
                    {new Date(check.check_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <span className="text-sm text-[#5f5f5f]">
                    {new Date(check.completed_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#5f5f5f] mb-1">Feeling</p>
                    <p className="text-base text-[#1f1f1f]">
                      {check.responses.energy_level}
                    </p>
                  </div>
                  {check.responses.intention && (
                    <div>
                      <p className="text-sm text-[#5f5f5f] mb-1">Focus</p>
                      <p className="text-base text-[#1f1f1f]">
                        {check.responses.intention}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
