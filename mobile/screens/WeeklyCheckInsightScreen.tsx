/**
 * Weekly Check Insight Screen (Mobile)
 * 
 * Display at most one insight and optional scope recommendation.
 * Calm, non-judgmental language.
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

interface WeeklyCheck {
  id: string;
  insight: string | null;
  scope_recommendation: string | null;
  completed_at: string;
}

interface WeeklyCheckInsightScreenProps {
  navigation: any;
  route: {
    params?: {
      weeklyCheckId?: string;
    };
  };
}

export function WeeklyCheckInsightScreen({ navigation, route }: WeeklyCheckInsightScreenProps) {
  const [loading, setLoading] = useState(true);
  const [weeklyCheck, setWeeklyCheck] = useState<WeeklyCheck | null>(null);
  const [activatingReducedMode, setActivatingReducedMode] = useState(false);

  useEffect(() => {
    const fetchWeeklyCheck = async () => {
      try {
        const id = route.params?.weeklyCheckId;
        if (id) {
          // Fetch specific weekly check by ID
          const check = await apiClient.get<WeeklyCheck>(`/weekly-check/${id}`);
          setWeeklyCheck(check);
        } else {
          // Fetch latest weekly check
          const check = await apiClient.get<WeeklyCheck>('/weekly-check/latest');
          setWeeklyCheck(check);
        }
        setLoading(false);
      } catch (err: any) {
        Alert.alert('', err.message || 'Unable to load. Try again in a moment.');
        setLoading(false);
      }
    };

    fetchWeeklyCheck();
  }, [route.params?.weeklyCheckId]);

  const handleActivateReducedMode = async () => {
    setActivatingReducedMode(true);
    try {
      await apiClient.post('/reduced-mode/activate');
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('', err.message || 'Unable to activate. Try again in a moment.');
      setActivatingReducedMode(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate('Home');
  };

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
          <Card>
            <View style={styles.header}>
              <Text style={styles.title}>Week Complete</Text>
              <Text style={styles.subtitle}>
                {weeklyCheck?.insight || 'Continue practicing.'}
              </Text>
            </View>

            {weeklyCheck?.scope_recommendation && (
              <View style={styles.recommendation}>
                <Text style={styles.recommendationText}>
                  {weeklyCheck.scope_recommendation}
                </Text>
                <Button
                  onPress={handleActivateReducedMode}
                  disabled={activatingReducedMode}
                  loading={activatingReducedMode}
                  variant="secondary"
                  fullWidth
                >
                  {activatingReducedMode ? 'Activating...' : 'Activate Reduced Mode'}
                </Button>
              </View>
            )}

            <Button onPress={handleContinue} fullWidth>
              Continue
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
  recommendation: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  recommendationText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
    marginBottom: spacing.md,
    lineHeight: typography.sizes.sm * 1.5,
  },
});
