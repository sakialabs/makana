/**
 * Weekly Check History Screen (Mobile)
 * 
 * Display past weekly reflections.
 * Calm, non-judgmental formatting.
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
  week_start_date: string;
  week_end_date: string;
  responses: {
    reflection?: string;
  };
  insight: string | null;
  completed_at: string;
}

interface WeeklyCheckHistoryScreenProps {
  navigation: any;
}

export function WeeklyCheckHistoryScreen({ navigation }: WeeklyCheckHistoryScreenProps) {
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<WeeklyCheck[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await apiClient.get<WeeklyCheck[]>('/weekly-check/history', {
          limit: 20,
        });
        setChecks(history);
        setLoading(false);
      } catch (err: any) {
        Alert.alert('', err.message || 'Unable to load. Try again in a moment.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
          <View style={styles.header}>
            <Text style={styles.title}>Weekly Check History</Text>
            <Text style={styles.subtitle}>Past reflections</Text>
          </View>

          {checks.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>
                No weekly checks yet. Complete one when ready.
              </Text>
            </Card>
          ) : (
            <View style={styles.checksList}>
              {checks.map((check) => (
                <Card key={check.id}>
                  <View style={styles.checkHeader}>
                    <Text style={styles.dateText}>
                      {formatDate(check.week_start_date)} - {formatDate(check.week_end_date)}
                    </Text>
                  </View>

                  {check.responses.reflection && (
                    <View style={styles.reflectionContainer}>
                      <Text style={styles.reflectionText}>
                        {check.responses.reflection}
                      </Text>
                    </View>
                  )}

                  {check.insight && (
                    <View style={styles.insightContainer}>
                      <Text style={styles.insightText}>
                        {check.insight}
                      </Text>
                    </View>
                  )}
                </Card>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Button onPress={() => navigation.navigate('Home')} variant="secondary" fullWidth>
              Back to Practice
            </Button>
          </View>
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
  checksList: {
    gap: spacing.md,
  },
  checkHeader: {
    marginBottom: spacing.sm,
  },
  dateText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  reflectionContainer: {
    marginBottom: spacing.sm,
  },
  reflectionText: {
    fontSize: typography.sizes.base,
    color: colors.charcoal,
    lineHeight: typography.sizes.base * 1.5,
  },
  insightContainer: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
  },
  insightText: {
    fontSize: typography.sizes.sm,
    color: colors.deepOlive,
    lineHeight: typography.sizes.sm * 1.5,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    textAlign: 'center',
  },
  footer: {
    marginTop: spacing.xl,
  },
});
