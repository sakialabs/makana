/**
 * Error Handling Utilities for Mobile
 * 
 * Provides calm, user-friendly error messages and error categorization.
 * Follows Makana's principle: no blame, no pressure, clear next steps.
 * Matches web implementation for cross-platform consistency.
 */

/**
 * Error categories for classification and logging
 */
export enum ErrorCategory {
  AUTH = 'auth',
  VALIDATION = 'validation',
  CONFLICT = 'conflict',
  NETWORK = 'network',
  SERVER = 'server',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Structured error interface
 */
export interface MakanaError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Calm error messages - no blame, clear next steps
 */
const calmMessages: Record<string, string> = {
  // Authentication errors
  'auth/invalid-credentials': 'Unable to sign in. Check your email and password.',
  'auth/user-not-found': 'No account found. Try signing up instead.',
  'auth/email-already-exists': 'This email is already registered. Try signing in.',
  'auth/weak-password': 'Choose a password with at least 8 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/session-expired': 'Your session expired. Sign in again to continue.',
  'auth/token-invalid': 'Your session expired. Sign in again to continue.',
  'auth/unauthorized': 'Sign in to continue.',
  
  // Validation errors
  'validation/required-field': 'This field is required.',
  'validation/invalid-format': 'Check the format and try again.',
  'validation/too-short': 'This is too short. Add a bit more.',
  'validation/too-long': 'This is too long. Shorten it a bit.',
  'validation/invalid-date': 'Enter a valid date.',
  'validation/invalid-number': 'Enter a valid number.',
  
  // Conflict errors
  'conflict/concurrent-session': 'Unable to start right now. Try again in a moment.',
  'conflict/duplicate-check': 'You have already completed today\'s check.',
  'conflict/resource-locked': 'This is currently in use. Try again in a moment.',
  
  // Network errors
  'network/offline': 'You are offline. Changes will sync when you are back online.',
  'network/timeout': 'This is taking longer than usual. Try again.',
  'network/connection-failed': 'Unable to connect. Check your connection and try again.',
  'network/slow-connection': 'Slow connection detected. This may take a moment.',
  
  // Server errors
  'server/internal-error': 'Something went wrong. Try again in a moment.',
  'server/service-unavailable': 'Service temporarily unavailable. Try again soon.',
  'server/maintenance': 'We are doing maintenance. Back soon.',
  'server/rate-limit': 'Too many requests. Wait a moment and try again.',
  
  // Not found errors
  'not-found/resource': 'This does not exist anymore.',
  'not-found/page': 'This page does not exist.',
  'not-found/session': 'This session does not exist.',
  
  // Permission errors
  'permission/denied': 'You do not have access to this.',
  'permission/read-only': 'You can view this but not change it.',
  
  // Unknown errors
  'unknown/error': 'Something unexpected happened. Try again.',
};

/**
 * Get calm, user-friendly error message
 */
export function getCalmMessage(errorCode: string): string {
  return calmMessages[errorCode] || calmMessages['unknown/error'];
}

/**
 * Categorize error based on status code or error type
 */
export function categorizeError(error: unknown): ErrorCategory {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Authentication errors
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('token')) {
      return ErrorCategory.AUTH;
    }
    
    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return ErrorCategory.VALIDATION;
    }
    
    // Conflict errors
    if (message.includes('conflict') || message.includes('duplicate') || message.includes('concurrent')) {
      return ErrorCategory.CONFLICT;
    }
    
    // Network errors
    if (message.includes('network') || message.includes('offline') || message.includes('timeout')) {
      return ErrorCategory.NETWORK;
    }
    
    // Not found errors
    if (message.includes('not found') || message.includes('404')) {
      return ErrorCategory.NOT_FOUND;
    }
    
    // Permission errors
    if (message.includes('permission') || message.includes('forbidden') || message.includes('403')) {
      return ErrorCategory.PERMISSION;
    }
  }
  
  // Check status code if available
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;
    
    if (status === 401 || status === 403) return ErrorCategory.AUTH;
    if (status === 404) return ErrorCategory.NOT_FOUND;
    if (status === 409) return ErrorCategory.CONFLICT;
    if (status === 422) return ErrorCategory.VALIDATION;
    if (status >= 500) return ErrorCategory.SERVER;
  }
  
  return ErrorCategory.UNKNOWN;
}

/**
 * Determine error severity
 */
export function getErrorSeverity(category: ErrorCategory): ErrorSeverity {
  switch (category) {
    case ErrorCategory.AUTH:
    case ErrorCategory.PERMISSION:
      return ErrorSeverity.WARNING;
    
    case ErrorCategory.VALIDATION:
    case ErrorCategory.CONFLICT:
    case ErrorCategory.NOT_FOUND:
      return ErrorSeverity.INFO;
    
    case ErrorCategory.NETWORK:
      return ErrorSeverity.WARNING;
    
    case ErrorCategory.SERVER:
    case ErrorCategory.UNKNOWN:
      return ErrorSeverity.ERROR;
    
    default:
      return ErrorSeverity.ERROR;
  }
}

/**
 * Convert any error to structured MakanaError
 */
export function toMakanaError(error: unknown, context?: Record<string, unknown>): MakanaError {
  const category = categorizeError(error);
  const severity = getErrorSeverity(category);
  
  let technicalMessage = 'Unknown error';
  let code: string | undefined;
  let statusCode: number | undefined;
  
  if (error instanceof Error) {
    technicalMessage = error.message;
    
    // Extract error code if present
    if ('code' in error && typeof error.code === 'string') {
      code = error.code;
    }
  }
  
  // Extract status code if present
  if (typeof error === 'object' && error !== null && 'status' in error) {
    statusCode = (error as { status: number }).status;
  }
  
  // Get user-friendly message
  const userMessage = code ? getCalmMessage(code) : getCalmMessage(`${category}/error`);
  
  return {
    category,
    severity,
    userMessage,
    technicalMessage,
    code,
    statusCode,
    timestamp: new Date().toISOString(),
    context,
  };
}

/**
 * Format error for display to user
 */
export function formatErrorForUser(error: MakanaError): string {
  return error.userMessage;
}

/**
 * Format error for logging (includes technical details)
 */
export function formatErrorForLogging(error: MakanaError): string {
  const parts = [
    `[${error.severity.toUpperCase()}]`,
    `[${error.category}]`,
    error.code ? `[${error.code}]` : '',
    error.statusCode ? `[${error.statusCode}]` : '',
    error.technicalMessage,
  ].filter(Boolean);
  
  return parts.join(' ');
}

/**
 * Check if error is recoverable (user can retry)
 */
export function isRecoverableError(error: MakanaError): boolean {
  return [
    ErrorCategory.NETWORK,
    ErrorCategory.CONFLICT,
    ErrorCategory.SERVER,
  ].includes(error.category);
}

/**
 * Get suggested action for error
 */
export function getSuggestedAction(error: MakanaError): string {
  switch (error.category) {
    case ErrorCategory.AUTH:
      return 'Sign in again to continue.';
    
    case ErrorCategory.VALIDATION:
      return 'Check your input and try again.';
    
    case ErrorCategory.CONFLICT:
      return 'Wait a moment and try again.';
    
    case ErrorCategory.NETWORK:
      return 'Check your connection and try again.';
    
    case ErrorCategory.SERVER:
      return 'Try again in a moment.';
    
    case ErrorCategory.NOT_FOUND:
      return 'Go back and try something else.';
    
    case ErrorCategory.PERMISSION:
      return 'Contact support if you need access.';
    
    default:
      return 'Try again or contact support.';
  }
}

/**
 * Common error codes for API responses
 */
export const ErrorCodes = {
  // Authentication
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  USER_NOT_FOUND: 'auth/user-not-found',
  EMAIL_EXISTS: 'auth/email-already-exists',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  SESSION_EXPIRED: 'auth/session-expired',
  TOKEN_INVALID: 'auth/token-invalid',
  UNAUTHORIZED: 'auth/unauthorized',
  
  // Validation
  REQUIRED_FIELD: 'validation/required-field',
  INVALID_FORMAT: 'validation/invalid-format',
  TOO_SHORT: 'validation/too-short',
  TOO_LONG: 'validation/too-long',
  INVALID_DATE: 'validation/invalid-date',
  INVALID_NUMBER: 'validation/invalid-number',
  
  // Conflict
  CONCURRENT_SESSION: 'conflict/concurrent-session',
  DUPLICATE_CHECK: 'conflict/duplicate-check',
  RESOURCE_LOCKED: 'conflict/resource-locked',
  
  // Network
  OFFLINE: 'network/offline',
  TIMEOUT: 'network/timeout',
  CONNECTION_FAILED: 'network/connection-failed',
  SLOW_CONNECTION: 'network/slow-connection',
  
  // Server
  INTERNAL_ERROR: 'server/internal-error',
  SERVICE_UNAVAILABLE: 'server/service-unavailable',
  MAINTENANCE: 'server/maintenance',
  RATE_LIMIT: 'server/rate-limit',
  
  // Not found
  RESOURCE_NOT_FOUND: 'not-found/resource',
  PAGE_NOT_FOUND: 'not-found/page',
  SESSION_NOT_FOUND: 'not-found/session',
  
  // Permission
  PERMISSION_DENIED: 'permission/denied',
  READ_ONLY: 'permission/read-only',
  
  // Unknown
  UNKNOWN_ERROR: 'unknown/error',
} as const;

/**
 * API error handler
 */
export function handleApiError(error: unknown, endpoint: string): MakanaError {
  const makanaError = toMakanaError(error, {
    endpoint,
    timestamp: new Date().toISOString(),
  });
  
  // Log for debugging
  if (__DEV__) {
    console.error('API Error:', formatErrorForLogging(makanaError));
  }
  
  return makanaError;
}

/**
 * Show error alert (React Native Alert)
 */
export function showErrorAlert(error: MakanaError): void {
  const { Alert } = require('react-native');
  
  Alert.alert(
    'Unable to complete',
    error.userMessage,
    [
      {
        text: 'OK',
        style: 'default',
      },
    ],
    { cancelable: true }
  );
}
