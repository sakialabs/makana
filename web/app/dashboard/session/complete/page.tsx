/**
 * Session Complete Page
 * 
 * Calm confirmation after completing session.
 * No metrics, no confetti, just acknowledgment.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function SessionCompletePage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
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
          <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
            Session Complete
          </h1>
          <p className="text-[#5f5f5f] mb-8">
            Clean stop.
          </p>
          <Button onClick={() => router.push('/dashboard')} fullWidth>
            Continue
          </Button>
        </Card>
      </Container>
    </div>
  );
}
