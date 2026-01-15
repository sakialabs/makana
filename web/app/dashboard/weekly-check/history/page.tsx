/**
 * Weekly Check History Page
 * 
 * Display past weekly reflections.
 * Calm, non-judgmental formatting.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

interface WeeklyCheck {
  id: string;
  week_start_date: string;
  week_end_date: string;
  responses: {
    reflection?: string;
  };
  insight: string | null;
  completed_at: string;
}

export default function WeeklyCheckHistoryPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<WeeklyCheck[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await apiClient.get<WeeklyCheck[]>('/weekly-check/history', {
          limit: 20,
        });
        setChecks(history);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

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
      <Container size="sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
            Weekly Check History
          </h1>
          <p className="text-[#5f5f5f]">
            Past reflections
          </p>
        </div>

        {checks.length === 0 ? (
          <Card>
            <p className="text-[#5f5f5f] text-center">
              No weekly checks yet. Complete one when ready.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {checks.map((check) => (
              <Card key={check.id}>
                <div className="mb-3">
                  <p className="text-sm text-[#5f5f5f]">
                    {formatDate(check.week_start_date)} - {formatDate(check.week_end_date)}
                  </p>
                </div>

                {check.responses.reflection && (
                  <div className="mb-3">
                    <p className="text-base text-[#1f1f1f]">
                      {check.responses.reflection}
                    </p>
                  </div>
                )}

                {check.insight && (
                  <div className="pt-3 border-t border-[#d6d2cb] dark:border-[#4A4A4A]">
                    <p className="text-sm text-[#2B2B2B]">
                      {check.insight}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button onClick={() => router.push('/dashboard')} variant="secondary" fullWidth>
            Back to Practice
          </Button>
        </div>
      </Container>
    </div>
  );
}
