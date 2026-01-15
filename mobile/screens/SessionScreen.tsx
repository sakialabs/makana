/**
 * Session Screen (Mobile) - Ignition
 * 
 * Start a focused session with minimal friction.
 * One primary action: Begin.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { colors, spacing, typography } from '../theme';
import { apiClient } from '../lib/api-client';

interface SessionScreenProps {
  navigation: any;
}

export function SessionScreen({ navigation }: SessionScreenProps) {
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [reducedModeActive, setReducedModeActive] = useState(false);

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        // Check for active session
        const session = await apiClient.get<{
          id: string;
          start_time: string;
          duration_minutes: number;
          status: string;
        }>('/sessions/active');
        
        if (session) {
          navigation.navigate('ActiveSession');
          return;
        }
        
        // Check reduced mode status
        const reducedModeData = await apiClient.get<{ is_active: boolean }>('/reduced-mode/status');
        setReducedModeActive(reducedModeData.is_active);
        
        setCheckingSession(false);
      } catch (err: any) {
        // No active session is expected - not an error
        setCheckingSession(false);
      }
    };

    checkActiveSession();
  }, [navigation]);

  const handleStartSession = async () => {
    setLoading(true);

    try {
      await apiClient.post('/sessions', { 
        setup_id: 'calm' 
      });

      // Navigate to active session
      navigation.navigate('ActiveSession');
    } catch (err: any) {
      if (err.code === 'CONCURRENT_SESSION') {
        Alert.alert('', 'Unable to start right now. Try again in a moment.');
      } else {
        Alert.alert('', err.message || 'Unable to start. Try again in a moment.');
      }
      setLoading(false);
    }
  };

  if (checkingSession) {
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
          <Card>
            <Text style={styles.title}>Ignition</Text>
            <Text style={styles.subtitle}>Begin when ready.</Text>

            <View style={styles.info}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Setup</Text>
                <Text style={styles.infoValue}>Calm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>
                  {reducedModeActive ? '15 minutes' : '25 minutes'}
                </Text>
              </View>
              {reducedModeActive && (
                <View style={styles.reducedModeIndicator}>
                  <Text style={styles.reducedModeText}>Reduced mode active</Text>
                </View>
              )}
            </View>

            <Button
              onPress={handleStartSession}
              fullWidth
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Starting...' : 'Begin Session'}
            </Button>
          </Card>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    textAlign: 'center',
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
    marginBottom: spacing.xl,
  },
  info: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  infoValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
  },
  reducedModeIndicator: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
  },
  reducedModeText: {
    fontSize: typography.sizes.sm,
    color: colors.deepOlive,
  },
});
