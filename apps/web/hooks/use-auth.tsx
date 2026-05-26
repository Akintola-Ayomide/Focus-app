"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: any, token?: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const res = await apiFetch('/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: any, token?: string) => {
    setUser(userData);
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
    }
    router.push('/dashboard');
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
