/**
 * Session History Screen (Mobile)
 * 
 * View recent sessions with dates, durations, and next steps.
 * No metrics, no streaks, just records.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { colors, spacing, typography } from '../theme';
import { apiClient } from '../lib/api-client';

interface Session {
  id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  next_step: string | null;
  status: 'completed' | 'abandoned';
}

interface SessionHistoryScreenProps {
  navigation: any;
}

export function SessionHistoryScreen({ navigation }: SessionHistoryScreenProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient.get<Session[]>('/sessions/recent', { limit: 10 });
        setSessions(data || []);
        setLoading(false);
      } catch (err: any) {
        // Empty history is not an error - just show empty state
        setSessions([]);
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
            <Text style={styles.title}>Session History</Text>
            <Text style={styles.subtitle}>Recent sessions</Text>
          </View>

          {sessions.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>
                No sessions yet. Begin when ready.
              </Text>
              <Button onPress={() => navigation.navigate('Session')}>
                Start Session
              </Button>
            </Card>
          ) : (
            <View style={styles.list}>
              {sessions.map((session) => (
                <Card key={session.id}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionDate}>
                      <Text style={styles.dateText}>
                        {new Date(session.start_time).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                      <Text style={styles.timeText}>
                        {new Date(session.start_time).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.duration}>
                      {session.duration_minutes} min
                    </Text>
                  </View>
                  {session.next_step && (
                    <View style={styles.nextStep}>
                      <Text style={styles.nextStepLabel}>Next step</Text>
                      <Text style={styles.nextStepText}>
                        {session.next_step}
                      </Text>
                    </View>
                  )}
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  sessionDate: {
    flex: 1,
  },
  dateText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  timeText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  duration: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
  },
  nextStep: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
    gap: spacing.xs,
  },
  nextStepLabel: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  nextStepText: {
    fontSize: typography.sizes.base,
    color: colors.charcoal,
  },
});
