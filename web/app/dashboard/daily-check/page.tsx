/**
 * Daily Check Page
 * 
 * Morning check-in and intention-setting interface.
 * One check per day, calm and non-judgmental.
 */

'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

export default function DailyCheckPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [energyLevel, setEnergyLevel] = useState('');
  const [intention, setIntention] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Check if user has already completed today's check
    const checkTodayStatus = async () => {
      if (!user) return;

      try {
        const response = await apiClient.get<{ id: string; check_date: string; responses: any }>(
          '/daily-check/today'
        );
        
        if (response) {
          setAlreadyCompleted(true);
        }
        setCheckingStatus(false);
      } catch (err: any) {
        // 404 means no check today - this is expected and not an error
        if (err.code === 'NOT_FOUND' || err.message?.includes('404')) {
          setAlreadyCompleted(false);
        }
        setCheckingStatus(false);
      }
    };

    if (user) {
      checkTodayStatus();
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!energyLevel.trim()) {
      setError('Please share how you are feeling.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/daily-check', {
        responses: { 
          energy_level: energyLevel, 
          intention: intention.trim() || undefined 
        }
      });

      // Redirect to confirmation
      router.push('/dashboard/daily-check/complete');
    } catch (err: any) {
      setError(err.message || 'Unable to save. Try again in a moment.');
      setLoading(false);
    }
  };

  if (authLoading || checkingStatus) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
        <Container size="sm">
          <Card>
            <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
              Already Complete
            </h1>
            <p className="text-[#5f5f5f] mb-6">
              You've completed today's check-in.
            </p>
            <Button onClick={() => router.push('/dashboard')} variant="secondary">
              Return to Dashboard
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
      <Container size="sm">
        <Card>
          <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
            Daily Check
          </h1>
          <p className="text-[#5f5f5f] mb-8">
            A brief check-in to start the day.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-[#1f1f1f] mb-3">
                How are you feeling today?
              </label>
              <Input
                type="text"
                placeholder="Rested, tired, uncertain..."
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                fullWidth
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#1f1f1f] mb-3">
                What matters today? (optional)
              </label>
              <Input
                type="text"
                placeholder="One thing you'd like to focus on"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                fullWidth
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-[#a5544a]/10 border border-[#a5544a]/20 rounded-md">
                <p className="text-sm text-[#a5544a]">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Saving...' : 'Complete Check-In'}
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}
