/**
 * Setups Screen
 * 
 * Allows users to view and select preset setups (Calm, Reduced, Vitality).
 * Displays current active setup and allows switching without restrictions.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { apiClient } from '../lib/api-client';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, spacing } from '../theme';

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

export function SetupsScreen() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [activeSetup, setActiveSetup] = useState<UserSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.deepOlive} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Setups</Text>
          <Text style={styles.subtitle}>
            Choose a setup that fits your current season of life. You can switch at any time.
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Setups List */}
        <View style={styles.setupsList}>
          {setups.map((setup) => {
            const isActive = activeSetup?.setup_id === setup.id;
            const isActivating = activating === setup.id;

            return (
              <Card
                key={setup.id}
                style={isActive ? styles.activeSetupCard : undefined}
              >
                {/* Setup Name and Active Indicator */}
                <View style={styles.setupHeader}>
                  <Text style={styles.setupName}>{setup.name}</Text>
                  {isActive && (
                    <Text style={styles.activeText}>Active</Text>
                  )}
                </View>

                {/* Duration */}
                <Text style={styles.setupDuration}>
                  {setup.duration_minutes} minutes
                </Text>

                {/* Description */}
                <Text style={styles.setupDescription}>
                  {setup.description}
                </Text>

                {/* Emphasis */}
                <Text style={styles.setupEmphasis}>
                  Emphasis: {setup.emphasis}
                </Text>

                {/* Activate Button */}
                {!isActive && (
                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={() => handleActivateSetup(setup.id)}
                      disabled={isActivating}
                    >
                      {isActivating ? 'Activating...' : 'Activate'}
                    </Button>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoText}>
            Switching setups won't affect your past sessions.
          </Text>
          <Text style={styles.infoText}>
            Your new setup will apply to all future sessions.
          </Text>
        </View>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  contentContainer: {
    paddingVertical: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.parchment,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedAsh,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: `${colors.error}15`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
  },
  setupsList: {
    gap: spacing.lg,
  },
  activeSetupCard: {
    borderWidth: 2,
    borderColor: colors.deepOlive,
  },
  setupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  setupName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.charcoal,
  },
  activeText: {
    fontSize: 14,
    color: colors.deepOlive,
    fontWeight: '600',
  },
  setupDuration: {
    fontSize: 16,
    color: colors.mutedAsh,
    marginBottom: spacing.md,
  },
  setupDescription: {
    fontSize: 16,
    color: colors.mutedAsh,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  setupEmphasis: {
    fontSize: 14,
    color: colors.mutedAsh,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  infoNote: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: colors.mutedAsh,
    textAlign: 'center',
  },
});
