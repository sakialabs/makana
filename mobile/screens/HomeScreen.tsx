/**
 * Home Screen (Mobile)
 * 
 * Landing screen for Makana mobile app.
 * Clean, minimal design with functional navigation.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { colors, spacing, typography } from '../theme';

interface HomeScreenProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export function HomeScreen({ onGetStarted, onSignIn }: HomeScreenProps) {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Container size="lg">
          {/* Hero Section */}
          <View style={styles.hero}>
            <Logo variant="animated" size="lg" />
            
            <Text style={styles.title}>Makana</Text>
            
            <Text style={styles.subtitle}>
              A practice medium for developing intentional strength.
            </Text>
            
            <View style={styles.buttonGroup}>
              <Button fullWidth onPress={onGetStarted}>
                Begin Practice
              </Button>
              <View style={styles.buttonSpacer} />
              <Button 
                variant="secondary" 
                fullWidth
                onPress={() => setShowFeatures(!showFeatures)}
              >
                {showFeatures ? 'Hide Details' : 'Learn More'}
              </Button>
            </View>
            
            {/* Sign-in link for returning users */}
            {onSignIn && (
              <Text 
                style={styles.signInLink}
                onPress={onSignIn}
                accessibilityRole="button"
                accessibilityLabel="Sign in for returning users"
              >
                Already practicing? Sign in
              </Text>
            )}
          </View>

          {/* Features Section - Only shown when Learn More is tapped */}
          {showFeatures && (
            <View style={styles.features}>
              <View>
                <Card padding="lg" style={styles.featureCard}>
                  <Text style={styles.featureTitle}>Start when it's hard</Text>
                  <Text style={styles.featureText}>
                    Begin meaningful work without resistance. Bad starts count.
                  </Text>
                </Card>
              </View>

              <View>
                <Card padding="lg" style={styles.featureCard}>
                  <Text style={styles.featureTitle}>Stop cleanly</Text>
                  <Text style={styles.featureText}>
                    Save the next tiny step. Stop without guilt or crashing.
                  </Text>
                </Card>
              </View>

              <View>
                <Card padding="lg" style={styles.featureCard}>
                  <Text style={styles.featureTitle}>Protect energy</Text>
                  <Text style={styles.featureText}>
                    Adjust force instead of forcing consistency. Continuity over intensity.
                  </Text>
                </Card>
              </View>
            </View>
          )}
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing['3xl'],  // 64px matching web py-24
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],  // 64px generous spacing
  },
  title: {
    fontSize: typography.sizes['4xl'],  // 36px
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.lg,  // 18px
    color: colors.mutedAsh,
    textAlign: 'center',
    lineHeight: typography.sizes.lg * typography.lineHeights.relaxed,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 400,
  },
  buttonSpacer: {
    height: spacing.md,  // 16px between buttons
  },
  signInLink: {
    marginTop: spacing.lg,  // 24px top margin
    fontSize: typography.sizes.base,  // 16px
    color: colors.mutedAsh,  // Subtle color
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  features: {
    gap: spacing.lg,  // 24px between cards
  },
  featureCard: {
    marginBottom: spacing.md,
  },
  featureTitle: {
    fontSize: typography.sizes.xl,  // 20px
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginBottom: spacing.sm,
    lineHeight: typography.sizes.xl * typography.lineHeights.tight,
  },
  featureText: {
    fontSize: typography.sizes.base,  // 16px
    color: colors.mutedAsh,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
});
