/**
 * Weekly Check Insight Page
 * 
 * Display at most one insight and optional scope recommendation.
 * Calm, non-judgmental language.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

interface WeeklyCheck {
  id: string;
  insight: string | null;
  scope_recommendation: string | null;
  completed_at: string;
}

export default function WeeklyCheckInsightPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weeklyCheck, setWeeklyCheck] = useState<WeeklyCheck | null>(null);
  const [activatingReducedMode, setActivatingReducedMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchWeeklyCheck = async () => {
      try {
        const id = searchParams.get('id');
        if (id) {
          // Fetch specific weekly check by ID
          const check = await apiClient.get<WeeklyCheck>(`/weekly-check/${id}`);
          setWeeklyCheck(check);
        } else {
          // Fetch latest weekly check
          const check = await apiClient.get<WeeklyCheck>('/weekly-check/latest');
          setWeeklyCheck(check);
        }
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWeeklyCheck();
    }
  }, [isAuthenticated, searchParams]);

  const handleActivateReducedMode = async () => {
    setActivatingReducedMode(true);
    try {
      await apiClient.post('/reduced-mode/activate');
      router.push('/dashboard');
    } catch (err: any) {
      setActivatingReducedMode(false);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
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
        <Card>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Week Complete
            </h1>
            <p className="text-[#5f5f5f]">
              {weeklyCheck?.insight || 'Continue practicing.'}
            </p>
          </div>

          {weeklyCheck?.scope_recommendation && (
            <div className="mb-6 p-4 bg-[#f7f5f2] dark:bg-[#1A1A1A] rounded-md border border-[#d6d2cb] dark:border-[#4A4A4A] transition-colors duration-200">
              <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] mb-4">
                {weeklyCheck.scope_recommendation}
              </p>
              <Button
                onClick={handleActivateReducedMode}
                disabled={activatingReducedMode}
                variant="secondary"
                fullWidth
              >
                {activatingReducedMode ? 'Activating...' : 'Activate Reduced Mode'}
              </Button>
            </div>
          )}

          <Button onClick={handleContinue} fullWidth>
            Continue
          </Button>
        </Card>
      </Container>
    </div>
  );
}
