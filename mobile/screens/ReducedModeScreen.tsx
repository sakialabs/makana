/**
 * Reduced Mode Screen (Mobile)
 * 
 * Toggle reduced mode for capacity-aware practice.
 * Calm explanation and easy toggling without restrictions.
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

interface ReducedModeState {
  is_active: boolean;
  activated_at: string | null;
  deactivated_at: string | null;
}

interface ReducedModeScreenProps {
  navigation: any;
}

export function ReducedModeScreen({ navigation }: ReducedModeScreenProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingState, setFetchingState] = useState(true);
  const [reducedModeState, setReducedModeState] = useState<ReducedModeState | null>(null);

  useEffect(() => {
    const fetchReducedModeState = async () => {
      try {
        const state = await apiClient.get<ReducedModeState>('/reduced-mode/status');
        setReducedModeState(state);
        setFetchingState(false);
      } catch (err: any) {
        Alert.alert('', err.message || 'Unable to load state. Try again in a moment.');
        setFetchingState(false);
      }
    };

    fetchReducedModeState();
  }, []);

  const handleToggle = async () => {
    if (!reducedModeState) return;

    setLoading(true);

    try {
      const endpoint = reducedModeState.is_active 
        ? '/reduced-mode/deactivate' 
        : '/reduced-mode/activate';
      
      const newState = await apiClient.post<ReducedModeState>(endpoint);
      setReducedModeState(newState);
    } catch (err: any) {
      Alert.alert('', err.message || 'Unable to update. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingState) {
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
              <Text style={styles.title}>Reduced Mode</Text>
              <Text style={styles.subtitle}>
                Adjust practice for low-capacity periods.
              </Text>
            </View>

            {reducedModeState && (
              <View style={styles.info}>
                <View style={styles.statusRow}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={[
                    styles.statusValue,
                    reducedModeState.is_active && styles.statusActive
                  ]}>
                    {reducedModeState.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                
                <View style={styles.explanation}>
                  <Text style={styles.explanationText}>
                    Reduced mode adjusts session duration to support continuity during difficult periods.
                  </Text>
                  <Text style={styles.explanationText}>
                    Sessions become shorter. Prompts stay simple. Practice continues.
                  </Text>
                </View>
              </View>
            )}

            <Button
              onPress={handleToggle}
              fullWidth
              disabled={loading}
              loading={loading}
              variant={reducedModeState?.is_active ? 'secondary' : 'primary'}
            >
              {loading 
                ? 'Updating...' 
                : reducedModeState?.is_active 
                  ? 'Deactivate Reduced Mode' 
                  : 'Activate Reduced Mode'}
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
  info: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  statusValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
  },
  statusActive: {
    color: colors.deepOlive,
  },
  explanation: {
    gap: spacing.sm,
  },
  explanationText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
    lineHeight: typography.sizes.sm * 1.5,
  },
});
