/**
 * Unified Auth Page
 * 
 * Single page for both Sign In and Sign Up with card flip animation
 */

'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { signIn, signUp, signInWithGoogle, signInWithApple, signInWithFacebook, signInWithGitHub, resendConfirmationEmail } from '@/lib/auth';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams?.get('mode');
  const messageParam = searchParams?.get('message');
  
  // Initialize mode based on URL parameter to avoid unwanted flip on first render
  const [mode, setMode] = useState<'signin' | 'signup'>(() => {
    return (modeParam === 'signin' || modeParam === 'signup') ? modeParam : 'signup';
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Update mode when search params change (for navigation from external pages)
  useEffect(() => {
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [modeParam]);
  
  // Mark as animated after initial mount
  useEffect(() => {
    setHasAnimated(true);
  }, []);
  
  // Handle message parameter from callback (Requirement 7.3)
  useEffect(() => {
    if (messageParam) {
      setConfirmationMessage(messageParam);
      // Clear message after 10 seconds
      setTimeout(() => {
        setConfirmationMessage(null);
      }, 10000);
    }
  }, [messageParam]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | 'facebook' | 'github' | null>(null);
  const [socialAuthNotice, setSocialAuthNotice] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const toggleMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin';
    setMode(newMode);
    
    // Update URL without page reload
    window.history.pushState({}, '', `/auth?mode=${newMode}`);
    
    // Reset form state when switching
    setEmail('');
    setPassword('');
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);
    setSocialAuthNotice(null); // Clear banner when switching
    setUnconfirmedEmail(null); // Clear unconfirmed email state
    setResendSuccess(false); // Clear resend success state
    setConfirmationMessage(null); // Clear confirmation message
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    setGeneralError(null);
    setSocialAuthNotice(null);
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
        setSocialAuthNotice(`${providerName} authentication coming soon!`);
      } else {
        setGeneralError(result.error.message);
      }
    }
    // If successful, Supabase will redirect automatically
  };

  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return;

    setResendLoading(true);
    setResendSuccess(false);
    setGeneralError(null);

    const result = await resendConfirmationEmail(unconfirmedEmail);
    setResendLoading(false);

    if (result.error) {
      setGeneralError(result.error.message);
    } else {
      setResendSuccess(true);
      // Clear success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);
    setUnconfirmedEmail(null);
    setResendSuccess(false);

    setLoading(true);

    if (mode === 'signin') {
      const { data, error } = await signIn({ email, password });
      setLoading(false);

      if (error) {
        // Check if error is due to unconfirmed email (Requirements 1.4, 1.5)
        if (error.message.toLowerCase().includes('confirm your email')) {
          setUnconfirmedEmail(email);
          setGeneralError(error.message);
        } else {
          setGeneralError(error.message);
        }
        return;
      }

      if (data) {
        router.push('/dashboard');
      }
    } else {
      // Sign-up flow
      const { data, error, requiresConfirmation } = await signUp({ email, password });
      setLoading(false);

      if (error) {
        setGeneralError(error.message);
        return;
      }

      if (data) {
        if (requiresConfirmation) {
          // Navigate to confirmation screen with email
          router.push(`/auth/confirm?email=${encodeURIComponent(email)}`);
        } else {
          // No confirmation required, redirect to onboarding for new users
          setSuccess(true);
          setTimeout(() => {
            router.push('/onboarding');
          }, 1500);
        }
      }
    }
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
        <Header />

        <main className="flex-1 flex items-center justify-center py-16 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
          <Container size="sm">
            <div className="flex justify-center mb-8">
              <Logo variant="animated" size="lg" />
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#d6d2cb] dark:border-[#4A4A4A] shadow-sm p-8 max-w-lg mx-auto">
              <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Account Created
              </h1>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">
                Welcome. Redirecting you now.
              </p>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    );
  }

  const isSignIn = mode === 'signin';

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main id="main-content" className="flex-1 py-12 md:py-16 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
        <Container size="sm">
          {/* Page Title - With entrance animation on initial load only */}
          <motion.div 
            initial={!hasAnimated ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <Logo variant="animated" size="md" />
            </div>
            <h1 className="text-4xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
              {isSignIn ? 'Welcome Back' : 'Begin Your Practice'}
            </h1>
            <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a]">
              {isSignIn ? 'Continue your practice' : 'Start developing intentional strength'}
            </p>
          </motion.div>

          {/* Card with Flip Animation */}
          <motion.div 
            initial={!hasAnimated ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="perspective-1000 max-w-lg mx-auto"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ 
                  rotateY: 90,
                  opacity: 0,
                }}
                animate={{ 
                  rotateY: 0,
                  opacity: 1,
                }}
                exit={{ 
                  rotateY: -90,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#d6d2cb] dark:border-[#4A4A4A] shadow-sm hover:shadow-md transition-shadow duration-300 p-8"
              >
                {/* Error Banners - BOTH AT THE TOP */}
                <div className="space-y-3 mb-6">
                  {/* Confirmation Message Banner (from callback) */}
                  <AnimatePresence>
                    {confirmationMessage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          transition: { duration: 0.2 }
                        }}
                        exit={{ 
                          opacity: 0,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="p-2.5 bg-[#a5d4a5]/10 border border-[#a5d4a5]/30 rounded-lg">
                          <p className="text-sm text-[#4a7a4a] text-center font-medium">
                            {confirmationMessage}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Social Auth Notice Banner */}
                  <AnimatePresence>
                    {socialAuthNotice && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          x: [0, -10, 10, -10, 10, 0],
                          transition: {
                            opacity: { duration: 0.2 },
                            x: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                          }
                        }}
                        exit={{ 
                          opacity: 0,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="p-2.5 bg-[#f4a5a5]/10 border border-[#f4a5a5]/30 rounded-lg">
                          <p className="text-sm text-[#a5544a] text-center font-medium">{socialAuthNotice}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Resend Success Banner */}
                  <AnimatePresence>
                    {resendSuccess && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          transition: { duration: 0.2 }
                        }}
                        exit={{ 
                          opacity: 0,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="p-2.5 bg-[#a5d4a5]/10 border border-[#a5d4a5]/30 rounded-lg">
                          <p className="text-sm text-[#4a7a4a] text-center font-medium">
                            Confirmation email sent. Check your inbox.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* General Error Banner */}
                  <AnimatePresence>
                    {generalError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          x: [0, -10, 10, -10, 10, 0],
                          transition: {
                            opacity: { duration: 0.2 },
                            x: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                          }
                        }}
                        exit={{ 
                          opacity: 0,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="p-2.5 bg-[#a5544a]/10 border border-[#a5544a]/30 rounded-lg">
                          <p className="text-sm text-[#a5544a] text-center font-medium">
                            {generalError}
                            {mode === 'signup' && generalError.includes('already registered') && (
                              <>
                                {' '}
                                <button
                                  type="button"
                                  onClick={toggleMode}
                                  className="underline hover:text-[#8a3d35] transition-colors"
                                >
                                  Sign in here
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Unconfirmed Email Banner with Resend Button */}
                  <AnimatePresence>
                    {unconfirmedEmail && mode === 'signin' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          transition: { duration: 0.2 }
                        }}
                        exit={{ 
                          opacity: 0,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="p-3 bg-[#f4a5a5]/10 border border-[#f4a5a5]/30 rounded-lg">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-sm text-[#a5544a] text-center font-medium">
                              Email confirmation required
                            </p>
                            <Button
                              type="button"
                              onClick={handleResendConfirmation}
                              disabled={resendLoading}
                              size="sm"
                              variant="secondary"
                            >
                              {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Email/Password Form */}
                  {/* Email/Password Form */}
                  <Input
                    type="email"
                    label="Email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError || undefined}
                    fullWidth
                    disabled={loading}
                    required
                  />
                  <Input
                    type="password"
                    label="Password"
                    placeholder={isSignIn ? '••••••••' : 'At least 8 characters'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError || undefined}
                    fullWidth
                    disabled={loading}
                    required
                  />

                  <Button type="submit" fullWidth disabled={loading} size="lg">
                    {loading 
                      ? (isSignIn ? 'Signing in...' : 'Creating account...')
                      : (isSignIn ? 'Sign In' : 'Create Account')
                    }
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#d6d2cb] dark:border-[#4A4A4A]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-[#1A1A1A] text-[#5f5f5f] dark:text-[#9a9a9a]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Auth Buttons - Icon Only */}
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading || socialLoading !== null}
                      className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#2A2A2A] border border-[#d6d2cb] dark:border-[#4A4A4A] rounded-full hover:bg-[#f7f5f2] dark:hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Continue with Google"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading || socialLoading !== null}
                      className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#2A2A2A] border border-[#d6d2cb] dark:border-[#4A4A4A] rounded-full hover:bg-[#f7f5f2] dark:hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Continue with Apple"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialAuth('facebook')}
                      disabled={loading || socialLoading !== null}
                      className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#2A2A2A] border border-[#d6d2cb] dark:border-[#4A4A4A] rounded-full hover:bg-[#f7f5f2] dark:hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Continue with Facebook"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialAuth('github')}
                      disabled={loading || socialLoading !== null}
                      className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#2A2A2A] border border-[#d6d2cb] dark:border-[#4A4A4A] rounded-full hover:bg-[#f7f5f2] dark:hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Continue with GitHub"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </button>
                  </div>
                </form>

                {/* Sign up/Sign in toggle - OUTSIDE FORM */}
                <div className="mt-8 text-center text-[#5f5f5f] dark:text-[#9a9a9a]">
                  {isSignIn ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[#2B2B2B] dark:text-[#eaeaea] hover:text-[#1B1B1B] dark:hover:text-white font-medium transition-colors underline"
                  >
                    {isSignIn ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Terms and Privacy - OUTSIDE CARD */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-[#5f5f5f] dark:text-[#9a9a9a] text-center mt-6"
          >
            {!isSignIn ? (
              <>
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline">
                  Privacy Policy
                </Link>
                .
              </>
            ) : (
              <>Secure authentication powered by Supabase</>
            )}
          </motion.p>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Logo variant="animated" size="md" />
        </main>
        <Footer />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
