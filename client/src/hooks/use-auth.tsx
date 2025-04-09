import React, { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  subscriptionLevel?: "free" | "paid" | "premium";
  emailVerified?: boolean;
  phoneVerified?: boolean;
  needsVerification?: boolean;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery<User | null>({
    queryKey: ['/api/user'],
    retry: false,
    staleTime: Infinity,
  });
  
  // Process the user data to add needsVerification flag
  const user = userData ? {
    ...userData,
    // User needs verification if email is not verified
    needsVerification: userData.emailVerified === false
  } : null;

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      return userData;
    },
    onSuccess: (data) => {
      // Add the needsVerification flag to the data
      const processedData = {
        ...data,
        needsVerification: data.emailVerified === false
      };
      
      // Set the user data immediately in the cache
      queryClient.setQueryData(['/api/user'], processedData);
      // Then invalidate the query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      const userData = await response.json();
      return userData;
    },
    onSuccess: (data) => {
      // Add the needsVerification flag to the data
      const processedData = {
        ...data,
        needsVerification: data.emailVerified === false
      };

      queryClient.setQueryData(['/api/user'], processedData);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
    },
    onSuccess: () => {
      // Set user to null immediately before invalidating the query
      queryClient.setQueryData(['/api/user'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        login: loginMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}