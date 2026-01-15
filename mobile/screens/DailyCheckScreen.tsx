/**
 * Daily Check Screen (Mobile)
 * 
 * Morning check-in and intention-setting interface.
 * One check per day, calm and non-judgmental.
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

interface DailyCheckScreenProps {
  navigation: any;
}

export function DailyCheckScreen({ navigation }: DailyCheckScreenProps) {
  const [energyLevel, setEnergyLevel] = useState('');
  const [intention, setIntention] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    // Check if user has already completed today's check
    const checkTodayStatus = async () => {
      try {
        const response = await apiClient.get<{ id: string; check_date: string; responses: any }>(
          '/daily-check/today'
        );
        
        if (response) {
          setAlreadyCompleted(true);
        }
        setCheckingStatus(false);
      } catch (err: any) {
        // 404 means no check today - this is expected and not an error
        if (err.code === 'NOT_FOUND' || err.message?.includes('404')) {
          setAlreadyCompleted(false);
        }
        setCheckingStatus(false);
      }
    };

    checkTodayStatus();
  }, []);

  const handleSubmit = async () => {
    if (!energyLevel.trim()) {
      Alert.alert('', 'Please share how you are feeling.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/daily-check', {
        responses: { 
          energy_level: energyLevel, 
          intention: intention.trim() || undefined 
        }
      });

      Alert.alert('Check-In Complete', 'Begin when ready.', [
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

  if (checkingStatus) {
    return (
      <View style={styles.container}>
        <Container>
          <Text style={styles.loadingText}>Loading...</Text>
        </Container>
      </View>
    );
  }

  if (alreadyCompleted) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Container>
            <Card>
              <Text style={styles.title}>Already Complete</Text>
              <Text style={styles.subtitle}>
                You've completed today's check-in.
              </Text>
              <Button onPress={() => navigation.navigate('Dashboard')}>
                Return to Dashboard
              </Button>
            </Card>
          </Container>
        </ScrollView>
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
            <Text style={styles.title}>Daily Check</Text>
            <Text style={styles.subtitle}>
              A brief check-in to start the day.
            </Text>

            <View style={styles.form}>
              <View style={styles.question}>
                <Text style={styles.label}>
                  How are you feeling today?
                </Text>
                <Input
                  placeholder="Rested, tired, uncertain..."
                  value={energyLevel}
                  onChangeText={setEnergyLevel}
                  fullWidth
                  editable={!loading}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.question}>
                <Text style={styles.label}>
                  What matters today? (optional)
                </Text>
                <Input
                  placeholder="One thing you'd like to focus on"
                  value={intention}
                  onChangeText={setIntention}
                  fullWidth
                  editable={!loading}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <Button
                onPress={handleSubmit}
                fullWidth
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Saving...' : 'Complete Check-In'}
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
});
