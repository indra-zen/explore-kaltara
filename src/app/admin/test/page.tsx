'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminTestPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const isAdminUser = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };

  useEffect(() => {
    console.log('AdminTestPage: Auth state changed:', {
      isLoading,
      isAuthenticated,
      userEmail: user?.email,
      authChecked
    });

    // Don't do anything while still loading auth state
    if (isLoading) {
      setAuthChecked(false);
      return;
    }

    // Mark that we've checked authentication
    setAuthChecked(true);

    // Only redirect if we're definitely not authenticated after loading
    if (!isAuthenticated || !user) {
      console.log('AdminTestPage: Redirecting to home - not authenticated');
      router.push('/');
      return;
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      console.log('AdminTestPage: Redirecting to home - not admin user');
      router.push('/');
      return;
    }

    console.log('AdminTestPage: User is authenticated admin, staying on page');
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading while auth is being determined
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Checking authentication...' : 'Processing authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // Only show "not authorized" or redirect if we've actually checked auth and confirmed user is not admin
  if (!isAuthenticated || !user || !isAdminUser(user.email)) {
    return null; // Let the useEffect handle the redirect
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User Email:</strong> {user?.email || 'None'}</p>
            <p><strong>Is Admin:</strong> {isAdminUser(user?.email) ? 'Yes' : 'No'}</p>
            <p><strong>Auth Checked:</strong> {authChecked ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <p className="text-green-600">
            ✅ If you can see this page, the authentication logic is working correctly!
          </p>
          <p className="text-gray-600 mt-2">
            The page should not redirect to the homepage on refresh if you're properly authenticated as an admin.
          </p>
          
          <div className="mt-6 space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Refresh (Click to refresh page)
            </button>
            
            <button 
              onClick={() => router.push('/admin')} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
