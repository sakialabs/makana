import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../lib/api-client';
import { toMakanaError } from '../lib/error-handling';
import { colors, spacing, typography } from '../theme/design-tokens';

interface Setup {
  id: string;
  name: string;
  description: string;
  default_session_duration: number;
  emphasis: string;
}

export function SetupScreen() {
  const navigation = useNavigation();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [activeSetup, setActiveSetup] = useState<Setup | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available setups and active setup in parallel
      const [setupsResponse, activeResponse] = await Promise.all([
        apiClient.get<Setup[]>('/setups'),
        apiClient.get<Setup>('/setups/active'),
      ]);

      setSetups(setupsResponse);
      setActiveSetup(activeResponse);
    } catch (err) {
      const makanaError = toMakanaError(err);
      setError(makanaError.userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (setupId: string) => {
    try {
      setActivating(setupId);
      setError(null);

      await apiClient.post('/setups/activate', {
        setup_id: setupId,
      });

      // Reload active setup
      const response = await apiClient.get<Setup>('/setups/active');
      setActiveSetup(response);

      // Show brief confirmation then return to home
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err) {
      const makanaError = toMakanaError(err);
      setError(makanaError.userMessage);
    } finally {
      setActivating(null);
    }
  };

  const getEmphasisLabel = (emphasis: string): string => {
    const labels: Record<string, string> = {
      rest: 'Rest',
      continuity: 'Continuity',
      health: 'Health',
    };
    return labels[emphasis] || emphasis;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deepOlive} />
          <Text style={styles.loadingText}>Loading setups...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Setup</Text>
          <Text style={styles.subtitle}>
            Select a setup that fits your current season. You can switch anytime.
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => setError(null)}
              style={styles.dismissButton}
            >
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.setupsList}>
          {setups.map((setup) => {
            const isActive = activeSetup?.id === setup.id;
            const isActivating = activating === setup.id;

            return (
              <View
                key={setup.id}
                style={[
                  styles.setupCard,
                  isActive && styles.setupCardActive,
                ]}
              >
                <View style={styles.setupContent}>
                  <View style={styles.setupHeader}>
                    <Text style={styles.setupName}>{setup.name}</Text>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.setupDescription}>
                    {setup.description}
                  </Text>
                  <View style={styles.setupMeta}>
                    <Text style={styles.setupMetaText}>
                      {setup.default_session_duration} minutes
                    </Text>
                    <Text style={styles.setupMetaText}>•</Text>
                    <Text style={styles.setupMetaText}>
                      Emphasis: {getEmphasisLabel(setup.emphasis)}
                    </Text>
                  </View>
                </View>

                {!isActive && (
                  <TouchableOpacity
                    onPress={() => handleActivate(setup.id)}
                    disabled={isActivating}
                    style={[
                      styles.selectButton,
                      isActivating && styles.selectButtonDisabled,
                    ]}
                  >
                    <Text style={styles.selectButtonText}>
                      {isActivating ? 'Activating...' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.slate,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: '#c33',
  },
  dismissButton: {
    marginLeft: spacing.md,
  },
  dismissText: {
    fontSize: typography.fontSize.sm,
    color: '#c33',
    fontWeight: '500',
  },
  setupsList: {
    gap: spacing.md,
  },
  setupCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightStone,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  setupCardActive: {
    borderWidth: 2,
    borderColor: colors.deepOlive,
    backgroundColor: colors.softStone,
  },
  setupContent: {
    marginBottom: spacing.md,
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  setupName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '500',
    color: colors.charcoal,
  },
  activeBadge: {
    backgroundColor: colors.deepOlive,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    fontWeight: '500',
  },
  setupDescription: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    marginBottom: spacing.sm,
  },
  setupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  setupMetaText: {
    fontSize: typography.fontSize.sm,
    color: colors.muted,
  },
  selectButton: {
    backgroundColor: colors.deepOlive,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  selectButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    fontWeight: '500',
  },
  backButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightStone,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.charcoal,
  },
});
