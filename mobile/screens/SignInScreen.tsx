/**
 * Sign In Screen (Mobile)
 * 
 * Authentication screen for existing users.
 * Integrates with Supabase Auth for secure authentication.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { Logo } from '../components/ui/Logo';
import { colors, spacing, typography } from '../theme';
import { signIn, signInWithGoogle, signInWithApple, signInWithFacebook, signInWithGitHub, validateEmail, validatePassword, resendConfirmationEmail } from '../lib/auth';

interface SignInScreenProps {
  navigation: any;
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | 'facebook' | 'github' | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    setSocialLoading(provider);

    let result;
    switch (provider) {
      case 'google':
        result = await signInWithGoogle();
        break;
      case 'apple':
        result = await signInWithApple();
        break;
      case 'facebook':
        result = await signInWithFacebook();
        break;
      case 'github':
        result = await signInWithGitHub();
        break;
    }

    setSocialLoading(null);

    if (result.error) {
      // Check if it's a provider not enabled error
      if (result.error.message.includes('not enabled') || result.error.message.includes('Unsupported provider')) {
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        Alert.alert('Coming Soon', `${providerName} authentication coming soon!`);
      } else {
        Alert.alert('Unable to connect', result.error.message);
      }
    }
    // If successful, Supabase will handle the OAuth flow
  };

  const handleSubmit = async () => {
    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    setUnconfirmedEmail(null);

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    // Attempt sign in
    setLoading(true);

    const { data, error } = await signIn({ email, password });

    setLoading(false);

    if (error) {
      // Check if error is due to unconfirmed email (Requirements 1.4, 1.5)
      if (error.message.toLowerCase().includes('confirm your email')) {
        setUnconfirmedEmail(email);
        // Show Alert with resend option
        Alert.alert(
          'Email Confirmation Required',
          error.message,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setUnconfirmedEmail(null),
            },
            {
              text: 'Resend Confirmation Email',
              onPress: handleResendConfirmation,
            },
          ]
        );
      } else {
        Alert.alert('Unable to sign in', error.message);
      }
      return;
    }

    if (data) {
      // Navigation will be handled by auth state listener
      // (will be implemented in App.tsx)
    }
  };

  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return;

    const result = await resendConfirmationEmail(unconfirmedEmail);

    if (result.error) {
      Alert.alert('Unable to send email', result.error.message);
    } else {
      Alert.alert('Email Sent', 'Confirmation email sent. Check your inbox.');
      setUnconfirmedEmail(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Container size="sm">
          {/* Logo */}
          <View 
            style={styles.logoContainer}
          >
            <Logo variant="animated" size="md" />
          </View>

          <View>
            <Card padding="lg">
              <Text style={styles.title}>Sign In</Text>

            <View style={styles.form}>
              {/* Email/Password Form */}
              <Input
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                error={emailError || undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                fullWidth
                editable={!loading}
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                error={passwordError || undefined}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                fullWidth
                editable={!loading}
              />

              <Button
                onPress={handleSubmit}
                fullWidth
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Auth Buttons - Icon Only */}
              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={styles.socialButtonCircle}
                  onPress={() => handleSocialAuth('google')}
                  disabled={loading || socialLoading !== null}
                >
                  <Text style={styles.socialButtonIcon}>G</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButtonCircle}
                  onPress={() => handleSocialAuth('apple')}
                  disabled={loading || socialLoading !== null}
                >
                  <Text style={styles.socialButtonIcon}></Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButtonCircle}
                  onPress={() => handleSocialAuth('facebook')}
                  disabled={loading || socialLoading !== null}
                >
                  <Text style={styles.socialButtonIcon}>f</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButtonCircle}
                  onPress={() => handleSocialAuth('github')}
                  disabled={loading || socialLoading !== null}
                >
                  <Text style={styles.socialButtonIcon}></Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                disabled={loading}
              >
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </Card>
          </View>
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
    paddingVertical: spacing['2xl'],  // 48px
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,  // 32px
  },
  title: {
    fontSize: typography.sizes['2xl'],  // 24px
    fontWeight: typography.weights.semibold,
    color: colors.charcoal,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,  // 16px between form elements
  },
  footer: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
  link: {
    fontSize: typography.sizes.sm,
    color: colors.accent,
    fontWeight: typography.weights.medium,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  socialButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialButtonIcon: {
    fontSize: 24,
    color: colors.charcoal,
    fontWeight: typography.weights.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.warmGray,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    fontSize: typography.sizes.sm,
    color: colors.mutedAsh,
  },
});
