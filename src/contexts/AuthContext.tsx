'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    favoriteLocations: string[];
    interests: string[];
    travelStyle: 'budget' | 'mid-range' | 'luxury';
  };
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users database
  const mockUsers = [
    {
      id: '1',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      preferences: {
        favoriteLocations: ['Tarakan', 'Malinau'],
        interests: ['Alam', 'Budaya', 'Fotografi'],
        travelStyle: 'mid-range' as const
      },
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sari Dewi',
      email: 'sari@example.com',
      password: 'password456',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      preferences: {
        favoriteLocations: ['Nunukan', 'Bulungan'],
        interests: ['Kuliner', 'Pantai', 'Adventure'],
        travelStyle: 'luxury' as const
      },
      joinDate: '2024-02-20'
    }
  ];

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('kaltara-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('kaltara-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        preferences: foundUser.preferences,
        joinDate: foundUser.joinDate
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('kaltara-user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      
      return { success: true, message: 'Login berhasil!' };
    } else {
      setIsLoading(false);
      return { success: false, message: 'Email atau password salah!' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, message: 'Email sudah terdaftar!' };
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=100`,
      preferences: {
        favoriteLocations: [],
        interests: [],
        travelStyle: 'mid-range'
      },
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    // Add to mock database (in real app, this would be API call)
    mockUsers.push({ ...newUser, password } as any);
    
    setUser(newUser);
    localStorage.setItem('kaltara-user', JSON.stringify(newUser));
    setIsLoading(false);
    
    return { success: true, message: 'Registrasi berhasil!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kaltara-user');
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('kaltara-user', JSON.stringify(updatedUser));
    
    setIsLoading(false);
    return true;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
