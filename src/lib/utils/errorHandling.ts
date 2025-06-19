/**
 * Standardized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

interface ToastMessage {
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

/**
 * Standard error handler that provides consistent error messaging
 * @param error - The error object or message
 * @param fallbackMessage - Fallback message if error is not informative
 * @param context - Additional context for debugging
 * @returns Formatted error message
 */
export const handleError = (
  error: unknown, 
  fallbackMessage: string = 'An unexpected error occurred',
  context?: string
): ToastMessage => {
  let message: string;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = fallbackMessage;
  }

  // Log detailed error for debugging
  if (context) {
    console.error(`[${context}]`, error);
  } else {
    console.error('Error:', error);
  }

  // Determine error type and provide user-friendly messages
  if (message.includes('auth') || message.includes('unauthorized')) {
    return {
      message: 'Authentication error. Please log in again.',
      variant: 'error'
    };
  }
  
  if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
    return {
      message: 'Network error. Please check your connection and try again.',
      variant: 'error'
    };
  }
  
  if (message.includes('permission') || message.includes('forbidden')) {
    return {
      message: 'You do not have permission to perform this action.',
      variant: 'error'
    };
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return {
      message: 'The requested resource was not found.',
      variant: 'error'
    };
  }

  return {
    message: message || fallbackMessage,
    variant: 'error'
  };
};

/**
 * Handle success messages consistently
 * @param message - Success message
 * @param context - Optional context for logging
 * @returns Formatted success message
 */
export const handleSuccess = (
  message: string,
  context?: string
): ToastMessage => {
  if (context) {
    console.log(`[${context}] Success:`, message);
  }
  
  return {
    message,
    variant: 'success'
  };
};

/**
 * Handle warning messages consistently
 * @param message - Warning message
 * @param context - Optional context for logging
 * @returns Formatted warning message
 */
export const handleWarning = (
  message: string,
  context?: string
): ToastMessage => {
  if (context) {
    console.warn(`[${context}] Warning:`, message);
  }
  
  return {
    message,
    variant: 'warning'
  };
};

/**
 * Async operation wrapper with error handling
 * @param operation - The async operation to execute
 * @param context - Context for error logging
 * @param fallbackMessage - Fallback error message
 * @returns Result with success/error status
 */
export const safeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  context: string,
  fallbackMessage?: string
): Promise<{ success: boolean; data?: T; error?: ToastMessage }> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const errorMessage = handleError(error, fallbackMessage, context);
    return { success: false, error: errorMessage };
  }
};

/**
 * Form validation error handler
 * @param errors - Validation errors object
 * @returns User-friendly error message
 */
export const handleValidationErrors = (errors: Record<string, string[]>): ToastMessage => {
  const firstError = Object.values(errors)[0]?.[0];
  return {
    message: firstError || 'Please check your input and try again.',
    variant: 'error'
  };
};

/**
 * Rate limiting error handler
 * @param retryAfter - Seconds to wait before retry
 * @returns Rate limit error message
 */
export const handleRateLimit = (retryAfter?: number): ToastMessage => {
  const waitTime = retryAfter ? `${retryAfter} seconds` : 'a moment';
  return {
    message: `Too many requests. Please wait ${waitTime} before trying again.`,
    variant: 'warning'
  };
};
