/**
 * Daily Check History Screen (Mobile)
 * 
 * View past check-ins in reverse chronological order.
 * Calm, non-judgmental display with generous spacing.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { colors, spacing, typography } from '../theme';
import { apiClient } from '../lib/api-client';

interface DailyCheck {
  id: string;
  check_date: string;
  responses: {
    energy_level: string;
    intention?: string;
  };
  completed_at: string;
}

interface DailyCheckHistoryScreenProps {
  navigation: any;
}

export function DailyCheckHistoryScreen({ navigation }: DailyCheckHistoryScreenProps) {
  const [checks, setChecks] = useState<DailyCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient.get<DailyCheck[]>('/daily-check/history', { limit: 10 });
        setChecks(data || []);
        setLoading(false);
      } catch (err: any) {
        // Empty history is not an error - just show empty state
        setChecks([]);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Container>
          <Text style={styles.loadingText}>Loading...</Text>
        </Container>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Container>
          <View style={styles.header}>
            <Text style={styles.title}>Check-In History</Text>
            <Text style={styles.subtitle}>Past daily check-ins</Text>
          </View>

          {checks.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>
                No check-ins yet. Start with today's check-in.
              </Text>
              <Button onPress={() => navigation.navigate('DailyCheck')}>
                Daily Check
              </Button>
            </Card>
          ) : (
            <View style={styles.list}>
              {checks.map((check) => (
                <Card key={check.id}>
                  <View style={styles.checkHeader}>
                    <Text style={styles.checkDate}>
                      {new Date(check.check_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.checkTime}>
                      {new Date(check.completed_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={styles.checkContent}>
                    <View style={styles.response}>
                      <Text style={styles.responseLabel}>Feeling</Text>
                      <Text style={styles.responseText}>
                        {check.responses.energy_level}
                      </Text>
                    </View>
                    {check.responses.intention && (
                      <View style={styles.response}>
                        <Text style={styles.responseLabel}>Focus</Text>
                        <Text style={styles.responseText}>
                          {check.responses.intention}
                        </Text>
                      </View>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          )}
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  scrollContent: {
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    textAlign: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  checkDate: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
    flex: 1,
  },
  checkTime: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  checkContent: {
    gap: spacing.md,
  },
  response: {
    gap: spacing.xs,
  },
  responseLabel: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  responseText: {
    fontSize: typography.sizes.base,
    color: colors.charcoal,
  },
});
