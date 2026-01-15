/**
 * Weekly Check Page
 * 
 * Reflect on the week and adjust scope.
 * One reflection question, calm and invitational.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

export default function WeeklyCheckPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reflection.trim()) {
      setError('Please share a reflection.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const weeklyCheck = await apiClient.post<{ id: string }>('/weekly-check', {
        responses: {
          reflection: reflection.trim(),
        },
      });

      // Navigate to insight page with the weekly check data
      router.push(`/dashboard/weekly-check/insight?id=${weeklyCheck.id}`);
    } catch (err: any) {
      setError(err.message || 'Unable to save. Try again in a moment.');
      setLoading(false);
    }
  };

  if (authLoading) {
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
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
                Weekly Check
              </h1>
              <p className="text-[#5f5f5f]">
                Reflect on the week.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="reflection" className="block text-base text-[#1f1f1f] mb-3">
                How was your capacity this week?
              </label>
              <textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#1A1A1A] border border-[#d6d2cb] dark:border-[#4A4A4A] rounded-md text-[#1f1f1f] dark:text-[#eaeaea] placeholder-[#5f5f5f] dark:placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] dark:focus:ring-[#4A4A4A] focus:border-transparent resize-none transition-colors duration-200"
                rows={4}
                placeholder="Optional. Share what feels right."
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-6 p-3 bg-[#a5544a]/10 border border-[#a5544a]/20 rounded-md">
                <p className="text-sm text-[#a5544a]">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Saving...' : 'Complete Check'}
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}
