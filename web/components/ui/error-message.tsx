/**
 * Error Message Component
 * 
 * Displays calm, user-friendly error messages.
 * No blame, no pressure, clear next steps.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { MakanaError, formatErrorForUser, getSuggestedAction, isRecoverableError } from '@/lib/error-handling';
import { Button } from './button';

export interface ErrorMessageProps {
  error: MakanaError | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  showSuggestedAction?: boolean;
  className?: string;
}

export function ErrorMessage({
  error,
  onDismiss,
  onRetry,
  showSuggestedAction = true,
  className = '',
}: ErrorMessageProps) {
  if (!error) return null;
  
  const userMessage = formatErrorForUser(error);
  const suggestedAction = getSuggestedAction(error);
  const canRetry = isRecoverableError(error) && onRetry;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`bg-[#d4a5a0] border border-[#a5544a] rounded-lg p-4 ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="text-[#a5544a]" size={20} aria-hidden="true" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-1">
              {userMessage}
            </p>
            
            {showSuggestedAction && (
              <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a]">
                {suggestedAction}
              </p>
            )}
            
            {canRetry && (
              <div className="mt-3">
                <Button
                  onClick={onRetry}
                  variant="secondary"
                  size="sm"
                  ariaLabel="Try again"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] rounded"
              aria-label="Dismiss error message"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Inline Error Message (for form fields)
 */
export interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className = '' }: InlineErrorProps) {
  if (!message) return null;
  
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.15 }}
      className={`text-sm text-[#a5544a] mt-1 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </motion.p>
  );
}

/**
 * Error Banner (for page-level errors)
 */
export interface ErrorBannerProps {
  error: MakanaError | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
  if (!error) return null;
  
  const userMessage = formatErrorForUser(error);
  const suggestedAction = getSuggestedAction(error);
  const canRetry = isRecoverableError(error) && onRetry;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-[#d4a5a0] border-b border-[#a5544a]"
        role="alert"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <AlertCircle className="text-[#a5544a] flex-shrink-0" size={20} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1f1f1f] dark:text-[#eaeaea]">
                  {userMessage}
                </p>
                <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] mt-0.5">
                  {suggestedAction}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {canRetry && (
                <Button
                  onClick={onRetry}
                  variant="secondary"
                  size="sm"
                  ariaLabel="Try again"
                >
                  Try Again
                </Button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] rounded p-1"
                  aria-label="Dismiss error banner"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Error Page (for full-page errors)
 */
export interface ErrorPageProps {
  error: MakanaError;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ErrorPage({ error, onRetry, onGoBack }: ErrorPageProps) {
  const userMessage = formatErrorForUser(error);
  const suggestedAction = getSuggestedAction(error);
  const canRetry = isRecoverableError(error) && onRetry;
  
  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-[#d4a5a0] rounded-full">
            <AlertCircle className="text-[#a5544a]" size={48} aria-hidden="true" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
          Unable to continue
        </h1>
        
        <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] mb-2">
          {userMessage}
        </p>
        
        <p className="text-base text-[#5f5f5f] dark:text-[#9a9a9a] mb-8">
          {suggestedAction}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {canRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              ariaLabel="Try again"
            >
              Try Again
            </Button>
          )}
          
          {onGoBack && (
            <Button
              onClick={onGoBack}
              variant="secondary"
              ariaLabel="Go back"
            >
              Go Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
