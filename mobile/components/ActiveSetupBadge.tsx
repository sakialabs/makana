import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { apiClient } from '../lib/api-client';
import { toMakanaError } from '../lib/error-handling';
import { colors, spacing, typography } from '../theme/design-tokens';

interface Setup {
  id: string;
  name: string;
  default_session_duration: number;
  emphasis: string;
}

export function ActiveSetupBadge() {
  const [setup, setSetup] = useState<Setup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveSetup();
  }, []);

  const loadActiveSetup = async () => {
    try {
      const response = await apiClient.get('/setups/active');
      setSetup(response.data);
    } catch (err) {
      const makanaError = toMakanaError(err);
      // Silently fail - not critical to show
    } finally {
      setLoading(false);
    }
  };

  if (loading || !setup) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <Text style={styles.text}>{setup.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.softStone,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.deepOlive,
  },
  text: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
});
