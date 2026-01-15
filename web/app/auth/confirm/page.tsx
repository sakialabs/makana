/**
 * Email Confirmation Screen
 * 
 * Displayed after sign-up when email confirmation is required.
 * Provides clear guidance and allows users to resend confirmation email.
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { resendConfirmationEmail } from '@/lib/auth';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get('email');

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Redirect to auth page if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/auth?mode=signup');
    }
  }, [email, router]);

  const handleResendEmail = async () => {
    if (!email) return;

    // Reset states
    setResendError(null);
    setResendSuccess(false);
    setResendLoading(true);

    const { error } = await resendConfirmationEmail(email);

    setResendLoading(false);

    if (error) {
      setResendError(error.message);
      return;
    }

    setResendSuccess(true);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setResendSuccess(false);
    }, 5000);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main className="flex-1 py-12 md:py-16 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
        <Container size="sm">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <Logo variant="animated" size="md" />
            </div>
            <h1 className="text-4xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
              Check Your Email
            </h1>
            <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a]">
              One more step to begin your practice
            </p>
          </motion.div>

          {/* Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#d6d2cb] dark:border-[#4A4A4A] shadow-sm p-8">
              {/* Success and Error Messages */}
              <div className="space-y-3 mb-6">
                {/* Success Message */}
                <AnimatePresence>
                  {resendSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                          Confirmation email sent. Check your inbox.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {resendError && (
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
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      <div className="p-3 bg-[#a5544a]/10 border border-[#a5544a]/30 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#a5544a] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#a5544a] font-medium">{resendError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Content */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ece9e4] dark:bg-[#2A2A2A] rounded-full mb-6">
                  <Mail className="w-8 h-8 text-[#2B2B2B] dark:text-[#eaeaea]" />
                </div>

                <h2 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                  Confirmation Email Sent
                </h2>

                <p className="text-[#5f5f5f] dark:text-[#9a9a9a] mb-2">
                  We sent a confirmation email to:
                </p>
                <p className="text-[#1f1f1f] dark:text-[#eaeaea] font-medium mb-6">
                  {email}
                </p>

                <div className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] space-y-2 text-left bg-[#f7f5f2] dark:bg-[#121212] rounded-lg p-4">
                  <p className="flex items-start gap-2">
                    <span className="text-[#2B2B2B] dark:text-[#eaeaea] font-medium">1.</span>
                    <span>Check your inbox for an email from Makana</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#2B2B2B] dark:text-[#eaeaea] font-medium">2.</span>
                    <span>Click the confirmation link in the email</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#2B2B2B] dark:text-[#eaeaea] font-medium">3.</span>
                    <span>If you don't see it, check your spam folder</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={resendLoading || resendSuccess}
                  fullWidth
                  size="lg"
                  variant="secondary"
                >
                  {resendLoading ? 'Sending...' : resendSuccess ? 'Email Sent!' : 'Resend Email'}
                </Button>

                <Link href="/auth?mode=signin" className="block">
                  <Button variant="ghost" fullWidth size="lg">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-[#5f5f5f] dark:text-[#9a9a9a] text-center mt-6"
          >
            Having trouble? <Link href="/contact" className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline">Contact support</Link>
          </motion.p>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function EmailConfirmationPage() {
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
      <ConfirmContent />
    </Suspense>
  );
}
