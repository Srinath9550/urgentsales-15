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
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  options: RequestInit = {}
) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const url = `${baseUrl}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  
  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

// Common API methods
export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    apiRequest('GET', endpoint, undefined, options),
  
  post: (endpoint: string, data: any, options?: RequestInit) => 
    apiRequest('POST', endpoint, data, options),
  
  put: (endpoint: string, data: any, options?: RequestInit) => 
    apiRequest('PUT', endpoint, data, options),
  
  delete: (endpoint: string, options?: RequestInit) => 
    apiRequest('DELETE', endpoint, undefined, options),
};

export default api;