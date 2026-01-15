/**
 * Authentication Utilities
 * 
 * Handles authentication logic with Supabase Auth.
 * Provides calm error messages and session management.
 */

import { supabase } from './supabase';

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpResponse {
  data: any | null;
  error: AuthError | null;
  requiresConfirmation: boolean;
}

export interface ResendConfirmationResponse {
  data: any | null;
  error: AuthError | null;
}

/**
 * Sign up a new user
 */
export async function signUp({ email, password }: SignUpData): Promise<SignUpResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: getCalmErrorMessage(error.message, 'signup'),
        code: error.status?.toString(),
      },
      requiresConfirmation: false,
    };
  }

  // Check if email confirmation is required
  // When email confirmation is enabled, Supabase returns a user but no session
  const requiresConfirmation = !!(data.user && !data.session);

  return { 
    data, 
    error: null,
    requiresConfirmation,
  };
}

/**
 * Sign in an existing user
 */
export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: {
        message: getCalmErrorMessage(error.message, 'signin'),
        code: error.status?.toString(),
      },
    };
  }

  return { data, error: null };
}

/**
 * Resend confirmation email to a user
 */
export async function resendConfirmationEmail(email: string): Promise<ResendConfirmationResponse> {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    // Handle rate limiting specifically
    if (error.message.toLowerCase().includes('rate') || 
        error.message.toLowerCase().includes('too many') ||
        error.status === 429) {
      return {
        data: null,
        error: {
          message: 'Please wait a moment before requesting another email.',
          code: error.status?.toString(),
        },
      };
    }

    // Handle other errors
    return {
      data: null,
      error: {
        message: 'Unable to send email. Try again in a moment.',
        code: error.status?.toString(),
      },
    };
  }

  return { 
    data, 
    error: null,
  };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  // For now, return a friendly error since provider is not configured
  return {
    data: null,
    error: {
      message: 'Google authentication coming soon!',
      code: 'provider_not_configured',
    },
  };
  
  /* Uncomment when Google OAuth is configured in Supabase:
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message,
        code: error.status?.toString(),
      },
    };
  }

  return { data, error: null };
  */
}

/**
 * Sign in with Apple OAuth
 */
export async function signInWithApple() {
  // For now, return a friendly error since provider is not configured
  return {
    data: null,
    error: {
      message: 'Apple authentication coming soon!',
      code: 'provider_not_configured',
    },
  };
  
  /* Uncomment when Apple OAuth is configured in Supabase:
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message,
        code: error.status?.toString(),
      },
    };
  }

  return { data, error: null };
  */
}

/**
 * Sign in with Facebook OAuth
 */
export async function signInWithFacebook() {
  // For now, return a friendly error since provider is not configured
  return {
    data: null,
    error: {
      message: 'Facebook authentication coming soon!',
      code: 'provider_not_configured',
    },
  };
  
  /* Uncomment when Facebook OAuth is configured in Supabase:
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message,
        code: error.status?.toString(),
      },
    };
  }

  return { data, error: null };
  */
}

/**
 * Sign in with GitHub OAuth
 */
export async function signInWithGitHub() {
  // For now, return a friendly error since provider is not configured
  return {
    data: null,
    error: {
      message: 'GitHub authentication coming soon!',
      code: 'provider_not_configured',
    },
  };
  
  /* Uncomment when GitHub OAuth is configured in Supabase:
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message,
        code: error.status?.toString(),
      },
    };
  }

  return { data, error: null };
  */
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: {
        message: getCalmErrorMessage(error.message),
        code: error.status?.toString(),
      },
    };
  }

  return { error: null };
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return {
      error: {
        message: getCalmErrorMessage(error.message),
        code: error.status?.toString(),
      },
    };
  }

  return { data: data.session, error: null };
}

/**
 * Get the current user
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return {
      error: {
        message: getCalmErrorMessage(error.message),
        code: error.status?.toString(),
      },
    };
  }

  return { data: data.user, error: null };
}

/**
 * Convert technical error messages to calm, user-friendly messages
 * @param technicalMessage - The technical error message from Supabase
 * @param context - The context in which the error occurred (signup or signin)
 */
function getCalmErrorMessage(technicalMessage: string, context?: 'signup' | 'signin'): string {
  const message = technicalMessage.toLowerCase();

  // Email not confirmed (Requirements 2.2)
  if (message.includes('email not confirmed') || message.includes('email_not_confirmed')) {
    return 'Please confirm your email first. Check your inbox for the confirmation link.';
  }

  // Invalid credentials (Requirements 2.2)
  if (message.includes('invalid') || message.includes('credentials')) {
    return 'Unable to sign in. Check your email and password.';
  }

  // User already exists - context-aware message (Requirements 2.3)
  if (message.includes('already') || message.includes('exists') || message.includes('user_already_exists')) {
    if (context === 'signup') {
      return 'This email is already registered. Try signing in instead.';
    }
    return 'This email is already registered.';
  }

  // Invalid email format (Requirements 2.4)
  if (message.includes('invalid') && message.includes('email')) {
    return 'Please enter a valid email address.';
  }

  // Password too short (Requirements 2.5)
  if (message.includes('password') && (message.includes('short') || message.includes('at least'))) {
    return 'Password must be at least 8 characters.';
  }

  // Network errors (Requirements 2.6)
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'Unable to connect. Check your connection.';
  }

  // Rate limiting (Requirements 2.7)
  if (message.includes('rate') || message.includes('too many') || message.includes('limit')) {
    return 'Too many attempts. Try again in a moment.';
  }

  // Generic fallback (Requirements 2.1)
  return 'Unable to complete. Try again in a moment.';
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }

  return null;
}

/**
 * Validate password
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return null;
}
