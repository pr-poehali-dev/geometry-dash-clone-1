import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  total_stars: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_URL = 'https://functions.poehali.dev/69b8d0a3-1c81-41d7-a10e-b22a2d22ffac';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string) => {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
