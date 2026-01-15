/**
 * Dashboard Page
 * 
 * Main authenticated view for users.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { ActiveSetupBadge } from '@/components/ui/active-setup-badge';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] dark:bg-[#121212]">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
      <Container>
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
              Practice
            </h1>
            <ActiveSetupBadge />
          </div>
          <p className="text-[#5f5f5f]" aria-label="User email">
            {user?.email}
          </p>
        </header>

        <nav aria-label="Practice navigation" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card 
            as="article"
            className="cursor-pointer hover:border-[#2B2B2B] transition-colors focus-within:ring-2 focus-within:ring-[#2B2B2B]" 
            onClick={() => router.push('/dashboard/daily-check')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/dashboard/daily-check')}
            ariaLabel="Navigate to Daily Check"
          >
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Daily Check
            </h2>
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
              Morning check-in
            </p>
          </Card>

          <Card 
            as="article"
            className="cursor-pointer hover:border-[#2B2B2B] transition-colors focus-within:ring-2 focus-within:ring-[#2B2B2B]" 
            onClick={() => router.push('/dashboard/session')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/dashboard/session')}
            ariaLabel="Navigate to Ignition"
          >
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Ignition
            </h2>
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
              Begin session
            </p>
          </Card>

          <Card 
            as="article"
            className="cursor-pointer hover:border-[#2B2B2B] transition-colors focus-within:ring-2 focus-within:ring-[#2B2B2B]" 
            onClick={() => router.push('/setups')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/setups')}
            ariaLabel="Navigate to Setups"
          >
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Setups
            </h2>
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
              Choose your practice setup
            </p>
          </Card>

          <Card 
            as="article"
            className="cursor-pointer hover:border-[#2B2B2B] transition-colors focus-within:ring-2 focus-within:ring-[#2B2B2B]" 
            onClick={() => router.push('/dashboard/reduced-mode')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/dashboard/reduced-mode')}
            ariaLabel="Navigate to Reduced Mode"
          >
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Reduced Mode
            </h2>
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
              Adjust for capacity
            </p>
          </Card>

          <Card 
            as="article"
            className="cursor-pointer hover:border-[#2B2B2B] transition-colors focus-within:ring-2 focus-within:ring-[#2B2B2B]" 
            onClick={() => router.push('/dashboard/weekly-check')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/dashboard/weekly-check')}
            ariaLabel="Navigate to Weekly Check"
          >
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              Weekly Check
            </h2>
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
              Reflect on the week
            </p>
          </Card>

          <Card 
            as="article"
            className="cursor-pointer hover:border-[#2B2B2B] transition-colors focus-within:ring-2 focus-within:ring-[#2B2B2B]" 
            onClick={() => router.push('/dashboard/session/history')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/dashboard/session/history')}
            ariaLabel="Navigate to History"
          >
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
              History
            </h2>
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
              Past sessions
            </p>
          </Card>
        </nav>

        <Card as="section" ariaLabel="Account actions">
          <Button onClick={handleSignOut} variant="secondary" ariaLabel="Sign out of your account">
            Sign Out
          </Button>
        </Card>
      </Container>
    </main>
  );
}
