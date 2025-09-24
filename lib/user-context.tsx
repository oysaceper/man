"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserContextType {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'guru_bk' | 'guru' | 'siswa' | 'petugas_absen';
  email?: string;
  image?: string;
}

interface UserContextProviderType {
  user: UserContextType | null;
  setUser: (user: UserContextType | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProviderType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData.user) {
            setUser(sessionData.user);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}