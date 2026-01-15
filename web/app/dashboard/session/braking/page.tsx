/**
 * Braking Page
 * 
 * Stop cleanly and capture next step.
 * No pressure, no requirement.
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

export default function BrakingPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [nextStep, setNextStep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fetchingSession, setFetchingSession] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Fetch active session to get session ID
    const fetchSession = async () => {
      try {
        const session = await apiClient.get<{ id: string }>('/sessions/active');
        if (session) {
          setSessionId(session.id);
        } else {
          // No active session - redirect
          router.push('/dashboard/session');
        }
        setFetchingSession(false);
      } catch (err: any) {
        // No active session
        router.push('/dashboard/session');
      }
    };

    if (isAuthenticated) {
      fetchSession();
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!sessionId) {
      setError('Unable to complete. Try again in a moment.');
      setLoading(false);
      return;
    }

    try {
      await apiClient.patch(`/sessions/${sessionId}/end`, {
        next_step: nextStep.trim() || undefined
      });

      // Redirect to completion
      router.push('/dashboard/session/complete');
    } catch (err: any) {
      setError(err.message || 'Unable to save. Try again in a moment.');
      setLoading(false);
    }
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
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
      <Container size="sm">
        <Card>
          <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
            Braking
          </h1>
          <p className="text-[#5f5f5f] mb-8">
            Capture the next tiny step, if you'd like.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-[#1f1f1f] mb-3">
                What comes next? (optional)
              </label>
              <Input
                type="text"
                placeholder="One small, concrete action..."
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                fullWidth
                disabled={loading}
              />
              <p className="mt-2 text-sm text-[#5f5f5f]">
                You can skip this if nothing comes to mind.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-[#a5544a]/10 border border-[#a5544a]/20 rounded-md">
                <p className="text-sm text-[#a5544a]">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Completing...' : 'Complete Session'}
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}
