/**
 * Active Session Screen (Mobile)
 * 
 * Minimal interface during active session.
 * Timer, stop action only.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { colors, spacing, typography } from '../theme';
import { apiClient } from '../lib/api-client';

interface ActiveSessionScreenProps {
  navigation: any;
}

export function ActiveSessionScreen({ navigation }: ActiveSessionScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fetchingSession, setFetchingSession] = useState(true);

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const session = await apiClient.get<{
          id: string;
          start_time: string;
          duration_minutes: number;
          status: string;
        }>('/sessions/active');

        if (!session) {
          // No active session - redirect to session start
          navigation.navigate('Session');
          return;
        }

        setSessionId(session.id);

        // Calculate time remaining
        const startTime = new Date(session.start_time).getTime();
        const durationMs = session.duration_minutes * 60 * 1000;
        const endTime = startTime + durationMs;
        const now = Date.now();
        const remainingMs = Math.max(0, endTime - now);
        const remainingSeconds = Math.floor(remainingMs / 1000);

        setTimeRemaining(remainingSeconds);
        setFetchingSession(false);
      } catch (err: any) {
        // No active session - redirect
        navigation.navigate('Session');
      }
    };

    fetchActiveSession();
  }, [navigation]);

  useEffect(() => {
    // Countdown timer
    if (timeRemaining <= 0 || fetchingSession) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, fetchingSession]);

  const handleStop = async () => {
    setLoading(true);
    // Navigate to braking screen
    navigation.navigate('Braking');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (fetchingSession) {
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
      <Container>
        <Card style={styles.card}>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerLabel}>Time remaining</Text>
          </View>

          <Button
            onPress={handleStop}
            fullWidth
            disabled={loading}
            loading={loading}
            variant="secondary"
          >
            {loading ? 'Stopping...' : 'Stop Session'}
          </Button>
        </Card>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  timer: {
    fontSize: 64,
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  timerLabel: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
});
