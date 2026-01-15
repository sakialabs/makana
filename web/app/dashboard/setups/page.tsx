/**
 * Setup Management Page
 * 
 * Allows users to view and select preset setups (Calm, Reduced, Vitality).
 * Displays current active setup and allows switching without restrictions.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';
import { Check } from 'lucide-react';

interface Setup {
  id: string;
  name: string;
  duration_minutes: number;
  description: string;
  emphasis: string;
}

interface UserSetup {
  setup_id: string;
  activated_at: string;
}

export default function SetupsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [activeSetup, setActiveSetup] = useState<UserSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch available setups and active setup in parallel
      const [setups, activeSetup] = await Promise.all([
        apiClient.get<Setup[]>('/api/v1/setups'),
        apiClient.get<UserSetup>('/api/v1/setups/active'),
      ]);

      setSetups(setups);
      setActiveSetup(activeSetup);
    } catch (err: any) {
      console.error('Error fetching setups:', err);
      setError(err.response?.data?.detail || 'Unable to load setups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSetup = async (setupId: string) => {
    try {
      setActivating(setupId);
      setError(null);

      const userSetup = await apiClient.post<UserSetup>('/api/v1/setups/activate', {
        setup_id: setupId,
      });

      setActiveSetup(userSetup);
    } catch (err: any) {
      console.error('Error activating setup:', err);
      setError(err.response?.data?.detail || 'Unable to activate setup. Please try again.');
    } finally {
      setActivating(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-20">
      <Container size="md">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
              Setups
            </h1>
            <p className="text-xl text-[#5f5f5f] max-w-2xl mx-auto">
              Choose a setup that fits your current season of life. You can switch at any time.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-[#a5544a]/10 border border-[#a5544a]/20 rounded-lg">
              <p className="text-sm text-[#a5544a]">{error}</p>
            </div>
          )}

          {/* Setups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {setups.map((setup) => {
              const isActive = activeSetup?.setup_id === setup.id;
              const isActivating = activating === setup.id;

              return (
                <Card
                  key={setup.id}
                  padding="lg"
                  className={isActive ? 'border-2 border-[#2B2B2B]' : ''}
                >
                  <div className="space-y-4">
                    {/* Setup Name */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                        {setup.name}
                      </h3>
                      {isActive && (
                        <div className="flex items-center space-x-2 text-[#2B2B2B]">
                          <Check size={20} />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <p className="text-lg text-[#5f5f5f]">
                      {setup.duration_minutes} minutes
                    </p>

                    {/* Description */}
                    <p className="text-[#5f5f5f] leading-relaxed">
                      {setup.description}
                    </p>

                    {/* Emphasis */}
                    <p className="text-sm text-[#5f5f5f] italic">
                      Emphasis: {setup.emphasis}
                    </p>

                    {/* Activate Button */}
                    {!isActive && (
                      <Button
                        fullWidth
                        onClick={() => handleActivateSetup(setup.id)}
                        disabled={isActivating}
                      >
                        {isActivating ? 'Activating...' : 'Activate'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Info Note */}
          <div className="text-center text-[#5f5f5f]">
            <p>Switching setups won't affect your past sessions.</p>
            <p>Your new setup will apply to all future sessions.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
