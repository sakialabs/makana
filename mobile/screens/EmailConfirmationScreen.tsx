/**
 * Email Confirmation Screen (Mobile)
 * 
 * Displayed after sign-up when email confirmation is required.
 * Provides clear guidance and allows users to resend confirmation email.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { colors, spacing, typography } from '../theme';
import { resendConfirmationEmail } from '../lib/auth';

interface EmailConfirmationScreenProps {
  navigation: any;
  route: {
    params?: {
      email?: string;
    };
  };
}

export function EmailConfirmationScreen({ navigation, route }: EmailConfirmationScreenProps) {
  const email = route.params?.email;

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Redirect to sign-up if no email provided
  useEffect(() => {
    if (!email) {
      Alert.alert(
        'Missing Information',
        'Please sign up to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignUp'),
          },
        ]
      );
    }
  }, [email, navigation]);

  const handleResendEmail = async () => {
    if (!email) return;

    // Reset states
    setResendSuccess(false);
    setResendLoading(true);

    const { error } = await resendConfirmationEmail(email);

    setResendLoading(false);

    if (error) {
      Alert.alert('Unable to send email', error.message);
      return;
    }

    setResendSuccess(true);
    Alert.alert('Email Sent', 'Confirmation email sent. Check your inbox.');
    
    // Clear success state after 5 seconds
    setTimeout(() => {
      setResendSuccess(false);
    }, 5000);
  };

  const handleBackToSignIn = () => {
    navigation.navigate('SignIn');
  };

  if (!email) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Container>
        <View style={styles.header}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>One more step to begin your practice</Text>
        </View>

        <Card>
          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✉️</Text>
            </View>

            <Text style={styles.heading}>Confirmation Email Sent</Text>

            <Text style={styles.description}>
              We sent a confirmation email to:
            </Text>
            <Text style={styles.email}>{email}</Text>

            <View style={styles.instructions}>
              <View style={styles.instructionRow}>
                <Text style={styles.instructionNumber}>1.</Text>
                <Text style={styles.instructionText}>
                  Check your inbox for an email from Makana
                </Text>
              </View>
              <View style={styles.instructionRow}>
                <Text style={styles.instructionNumber}>2.</Text>
                <Text style={styles.instructionText}>
                  Click the confirmation link in the email
                </Text>
              </View>
              <View style={styles.instructionRow}>
                <Text style={styles.instructionNumber}>3.</Text>
                <Text style={styles.instructionText}>
                  If you don't see it, check your spam folder
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              onPress={handleResendEmail}
              disabled={resendLoading || resendSuccess}
              loading={resendLoading}
              fullWidth
              size="lg"
              variant="secondary"
            >
              {resendSuccess ? 'Email Sent!' : 'Resend Email'}
            </Button>

            <Button
              onPress={handleBackToSignIn}
              variant="ghost"
              fullWidth
              size="lg"
            >
              Back to Sign In
            </Button>
          </View>
        </Card>

        {/* Help Text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
              <Text style={styles.footerLink}>Contact support</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </Container>
    </ScrollView>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.mutedAsh,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
  },
  heading: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.mutedAsh,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  email: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    padding: spacing.md,
    width: '100%',
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  instructionNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
    marginRight: spacing.xs,
    width: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  actions: {
    gap: spacing.sm,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.xs,
    color: colors.mutedAsh,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.charcoal,
    textDecorationLine: 'underline',
  },
});
