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
export async function apiRequest({
  url,
  method = 'GET',
  body,
  headers = {},
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}) {
  console.log(`API Request: ${method} ${url}`);
  
  const token = localStorage.getItem('token');
  const isFormData = body instanceof FormData;
  
  // Don't set Content-Type for FormData as the browser needs to set the boundary
  const requestHeaders: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...headers,
  };
  
  console.log("Request headers:", requestHeaders);
  
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };
  
  if (body && method !== 'GET') {
    if (isFormData) {
      console.log("Sending FormData body");
      requestOptions.body = body;
    } else {
      console.log("Sending JSON body");
      requestOptions.body = JSON.stringify(body);
    }
  }
  
  try {
    console.log(`Fetching ${url} with options:`, {
      method,
      headers: requestHeaders,
      bodyType: isFormData ? 'FormData' : (body ? 'JSON' : 'none')
    });
    
    const response = await fetch(url, requestOptions);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      
      // Try to parse error response
      try {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw {
          status: response.status,
          message: errorData.message || 'Request failed',
          data: errorData
        };
      } catch (parseError) {
        // If we can't parse JSON, use status text
        throw {
          status: response.status,
          message: response.statusText || 'Request failed',
        };
      }
    }
    
    // Check if response is empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log("Response data:", data);
      return data;
    } else {
      console.log("Response is not JSON");
      return { success: true, status: response.status };
    }
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// Common API methods
export const api = {
  get: (endpoint: string, headers?: Record<string, string>) => 
    apiRequest({
      url: endpoint,
      method: 'GET',
      headers
    }),
  
  post: (endpoint: string, body: any, headers?: Record<string, string>) => 
    apiRequest({
      url: endpoint,
      method: 'POST',
      body,
      headers
    }),
  
  put: (endpoint: string, body: any, headers?: Record<string, string>) => 
    apiRequest({
      url: endpoint,
      method: 'PUT',
      body,
      headers
    }),
  
  delete: (endpoint: string, headers?: Record<string, string>) => 
    apiRequest({
      url: endpoint,
      method: 'DELETE',
      headers
    }),
};

export default api;