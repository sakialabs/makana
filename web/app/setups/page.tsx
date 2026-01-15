'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { apiClient } from '@/lib/api-client';
import { ErrorMessage } from '@/components/ui/error-message';
import { toMakanaError, ErrorCategory, ErrorSeverity } from '@/lib/error-handling';
import { logError } from '@/lib/error-logger';

interface Setup {
  id: string;
  name: string;
  description: string;
  default_session_duration: number;
  emphasis: string;
}

export default function SetupsPage() {
  const router = useRouter();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [activeSetup, setActiveSetup] = useState<Setup | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available setups and active setup in parallel
      const [setupsResponse, activeResponse] = await Promise.all([
        apiClient.get<Setup[]>('/setups'),
        apiClient.get<Setup>('/setups/active'),
      ]);

      setSetups(setupsResponse);
      setActiveSetup(activeResponse);
    } catch (err) {
      const makanaError = toMakanaError(err);
      setError(makanaError.userMessage);
      logError(makanaError);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (setupId: string) => {
    try {
      setActivating(setupId);
      setError(null);

      await apiClient.post('/setups/activate', {
        setup_id: setupId,
      });

      // Reload active setup
      const response = await apiClient.get<Setup>('/setups/active');
      setActiveSetup(response);

      // Show brief confirmation then return to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      const makanaError = toMakanaError(err);
      setError(makanaError.userMessage);
      logError(makanaError);
    } finally {
      setActivating(null);
    }
  };

  const getEmphasisLabel = (emphasis: string): string => {
    const labels: Record<string, string> = {
      rest: 'Rest',
      continuity: 'Continuity',
      health: 'Health',
    };
    return labels[emphasis] || emphasis;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] py-16">
      <Container size="md">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-2">
            Choose Your Setup
          </h1>
          <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">
            Select a setup that fits your current season. You can switch anytime.
          </p>
        </div>

        {error && (
          <ErrorMessage
            error={{ 
              userMessage: error, 
              category: ErrorCategory.UNKNOWN, 
              severity: ErrorSeverity.ERROR, 
              technicalMessage: error, 
              timestamp: new Date().toISOString() 
            }}
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}

        <div className="space-y-4 mb-8">
          {setups.map((setup) => {
            const isActive = activeSetup?.id === setup.id;
            const isActivating = activating === setup.id;

            return (
              <Card
                key={setup.id}
                className={`p-6 ${
                  isActive
                    ? 'border-2 border-[#2B2B2B] bg-[#ece9e4] dark:bg-[#1A1A1A] dark:border-[#4A4A4A]'
                    : 'border border-[#d6d2cb] dark:border-[#4A4A4A]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-medium text-[#1f1f1f] dark:text-[#eaeaea]">
                        {setup.name}
                      </h2>
                      {isActive && (
                        <span className="text-sm text-[#2B2B2B] font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[#5f5f5f] dark:text-[#9a9a9a] mb-3">{setup.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
                      <span>{setup.default_session_duration} minutes</span>
                      <span>•</span>
                      <span>Emphasis: {getEmphasisLabel(setup.emphasis)}</span>
                    </div>
                  </div>
                  <div>
                    {!isActive && (
                      <Button
                        onClick={() => handleActivate(setup.id)}
                        disabled={isActivating}
                      >
                        {isActivating ? 'Activating...' : 'Select'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={() => router.push('/dashboard')}
          variant="secondary"
        >
          Back to Dashboard
        </Button>
      </Container>
    </div>
  );
}
