
import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      queryFn: async ({ queryKey }) => {
        const [url, options] = queryKey as [string, any];
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      },
    },
  },
});

/**
 * Helper function for API requests
 */
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}
