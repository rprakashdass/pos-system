"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiService from './apiService';
import { AuthResponse, User } from '@/types/authTypes';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const currentUser = await apiService.get<User>('/v1/users/me');
          setUser(currentUser);
        } catch (error) {
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [router]);

  const login = async (credentials: any) => {
    const response = await apiService.post<AuthResponse>('/v1/auth/authenticate', credentials);
    if (response && response.access_token) {
      localStorage.setItem('accessToken', response.access_token);
      const currentUser = await apiService.get<User>('/v1/users/me');
      setUser(currentUser);
      router.push('/');
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
