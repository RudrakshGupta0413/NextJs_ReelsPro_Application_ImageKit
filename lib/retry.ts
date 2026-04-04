/**
 * Simple utility for retrying asynchronous functions with exponential backoff.
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  retryOnStatusCodes?: number[];
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    retryOnStatusCodes = [429, 500, 503], // Common retryable status codes
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Extract status code from various possible error formats
      const status = error?.status || error?.response?.status || error?.code;
      
      const isRetryable =
        retryOnStatusCodes.includes(status) ||
        error.message?.toLowerCase().includes("too many requests") ||
        error.message?.toLowerCase().includes("quota");

      if (attempt < maxRetries && isRetryable) {
        const delay = Math.min(
          initialDelayMs * Math.pow(2, attempt),
          maxDelayMs
        );
        
        console.warn(
          `Gemini API Retry: Attempt ${attempt + 1}/${maxRetries} failed with status ${status}. Retrying in ${delay}ms...`
        );
        
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If not retryable or we've reached max retries, throw
      throw error;
    }
  }

  throw lastError;
}
