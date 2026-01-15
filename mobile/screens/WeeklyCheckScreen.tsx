/**
 * Weekly Check Screen (Mobile)
 * 
 * Reflect on the week and adjust scope.
 * One reflection question, calm and invitational.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { colors, spacing, typography } from '../theme';
import { apiClient } from '../lib/api-client';

interface WeeklyCheckScreenProps {
  navigation: any;
}

export function WeeklyCheckScreen({ navigation }: WeeklyCheckScreenProps) {
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState('');

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      Alert.alert('', 'Please share a reflection.');
      return;
    }

    setLoading(true);

    try {
      const weeklyCheck = await apiClient.post<{ id: string }>('/weekly-check', {
        responses: {
          reflection: reflection.trim(),
        },
      });

      // Navigate to insight screen with the weekly check data
      navigation.navigate('WeeklyCheckInsight', { weeklyCheckId: weeklyCheck.id });
    } catch (err: any) {
      Alert.alert('', err.message || 'Unable to save. Try again in a moment.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Container>
          <Card>
            <View style={styles.header}>
              <Text style={styles.title}>Weekly Check</Text>
              <Text style={styles.subtitle}>Reflect on the week.</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                How was your capacity this week?
              </Text>
              <TextInput
                style={styles.textArea}
                value={reflection}
                onChangeText={setReflection}
                placeholder="Optional. Share what feels right."
                placeholderTextColor={colors.mutedAsh}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            <Button
              onPress={handleSubmit}
              fullWidth
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Saving...' : 'Complete Check'}
            </Button>
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
    justifyContent: 'center',
    paddingVertical: spacing.xl,
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
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.base,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.warmGray,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.charcoal,
    minHeight: 120,
    lineHeight: typography.sizes.base * 1.5,
  },
});
