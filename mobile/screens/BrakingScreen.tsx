/**
 * Braking Screen (Mobile)
 * 
 * Stop cleanly and capture next step.
 * No pressure, no requirement.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { colors, spacing, typography } from '../theme';
import { apiClient } from '../lib/api-client';

interface BrakingScreenProps {
  navigation: any;
}

export function BrakingScreen({ navigation }: BrakingScreenProps) {
  const [nextStep, setNextStep] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fetchingSession, setFetchingSession] = useState(true);

  useEffect(() => {
    // Fetch active session to get session ID
    const fetchSession = async () => {
      try {
        const session = await apiClient.get<{ id: string }>('/sessions/active');
        if (session) {
          setSessionId(session.id);
        } else {
          // No active session - redirect
          navigation.navigate('Session');
        }
        setFetchingSession(false);
      } catch (err: any) {
        // No active session
        navigation.navigate('Session');
      }
    };

    fetchSession();
  }, [navigation]);

  const handleSubmit = async () => {
    if (!sessionId) {
      Alert.alert('', 'Unable to complete. Try again in a moment.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.patch(`/sessions/${sessionId}/end`, {
        next_step: nextStep.trim() || undefined
      });

      Alert.alert('Session Complete', 'Clean stop.', [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Unable to save', err.message || 'Try again in a moment.');
      setLoading(false);
    }
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Card>
            <Text style={styles.title}>Braking</Text>
            <Text style={styles.subtitle}>
              Capture the next tiny step, if you'd like.
            </Text>

            <View style={styles.form}>
              <View style={styles.question}>
                <Text style={styles.label}>
                  What comes next? (optional)
                </Text>
                <Input
                  placeholder="One small, concrete action..."
                  value={nextStep}
                  onChangeText={setNextStep}
                  fullWidth
                  editable={!loading}
                  multiline
                  numberOfLines={3}
                />
                <Text style={styles.hint}>
                  You can skip this if nothing comes to mind.
                </Text>
              </View>

              <Button
                onPress={handleSubmit}
                fullWidth
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Completing...' : 'Complete Session'}
              </Button>
            </View>
          </Card>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    textAlign: 'center',
    marginTop: spacing.xl,
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
  form: {
    gap: spacing.lg,
  },
  question: {
    gap: spacing.md,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
  },
  hint: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
});
