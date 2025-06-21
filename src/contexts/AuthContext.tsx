'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

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
  // Helper function to convert Supabase profile to our User type
  const convertProfileToUser = (profile: Profile): User => ({
    id: profile.id,
    name: profile.name || 'User',
    email: profile.email,
    avatar: profile.avatar_url || undefined,
    preferences: {
      favoriteLocations: profile.favorite_locations || [],
      interests: profile.interests || [],
      travelStyle: profile.travel_style || 'mid-range'
    },
    joinDate: new Date(profile.created_at).toISOString().split('T')[0]
  });  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // If profile doesn't exist, create it
          if (!profile) {
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User')}&background=10b981&color=fff&size=100`
              })
              .select()
              .single();
            
            profile = newProfile;
          }
          
          if (profile) {
            setUser(convertProfileToUser(profile));
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // If profile doesn't exist, create it
          if (!profile) {
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User')}&background=10b981&color=fff&size=100`
              })
              .select()
              .single();
            
            profile = newProfile;
          }
          
          if (profile) {
            setUser(convertProfileToUser(profile));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        // Only set loading to false if we're not already loading the initial session
        if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { 
          success: false, 
          message: error.message === 'Invalid login credentials' 
            ? 'Email atau password salah!' 
            : error.message 
        };
      }

      if (data.user) {
        // Profile will be set automatically by the auth state change listener
        setIsLoading(false);
        return { success: true, message: 'Login berhasil!' };
      }

      setIsLoading(false);
      return { success: false, message: 'Terjadi kesalahan saat login!' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Terjadi kesalahan saat login!' };
    }
  };  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      console.log('Registration response:', { data, error });

      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          return { success: false, message: 'Email sudah terdaftar!' };
        } else if (error.message.includes('email_address_invalid')) {
          return { success: false, message: 'Format email tidak valid!' };
        } else if (error.message.includes('password')) {
          return { success: false, message: 'Password harus minimal 6 karakter!' };
        }
        
        return { 
          success: false, 
          message: `Error: ${error.message}`
        };
      }      if (data.user) {
        console.log('User created:', data.user);
        
        // If user is confirmed or confirmations are disabled, sign them in
        if (data.user.email_confirmed_at || data.session) {
          console.log('User confirmed, creating profile...');
          
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                name: name
              })
              .select()
              .single();
            
            if (profileError) {
              console.warn('Profile creation failed:', profileError.message);
            } else {
              console.log('Profile created:', profileData);
              setUser(convertProfileToUser(profileData));
            }
          } catch (profileErr) {
            console.warn('Profile creation error:', profileErr);
          }
        } else {
          console.log('User needs email confirmation - profile will be created on first login');
        }
        
        setIsLoading(false);
        return { 
          success: true, 
          message: data.user.email_confirmed_at 
            ? 'Registrasi berhasil! Anda sudah masuk.' 
            : 'Registrasi berhasil! Silakan cek email untuk verifikasi, lalu login.'
        };
      }

      setIsLoading(false);
      return { success: false, message: 'Terjadi kesalahan saat registrasi!' };
    } catch (error) {
      console.error('Registration catch error:', error);
      setIsLoading(false);
      return { success: false, message: `Terjadi kesalahan: ${error}` };
    }
  };  const logout = async () => {
    try {
      console.log('Starting logout process...');
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Supabase signOut successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user state regardless of any errors
      console.log('Clearing user state...');
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const profileUpdates: Database['public']['Tables']['profiles']['Update'] = {};
      
      if (updates.name !== undefined) {
        profileUpdates.name = updates.name;
      }
      
      if (updates.preferences) {
        if (updates.preferences.favoriteLocations !== undefined) {
          profileUpdates.favorite_locations = updates.preferences.favoriteLocations;
        }
        if (updates.preferences.interests !== undefined) {
          profileUpdates.interests = updates.preferences.interests;
        }
        if (updates.preferences.travelStyle !== undefined) {
          profileUpdates.travel_style = updates.preferences.travelStyle;
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setIsLoading(false);
        return false;
      }

      if (data) {
        setUser(convertProfileToUser(data));
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      return false;
    }
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
