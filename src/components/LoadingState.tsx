'use client';

import LoadingSpinner from './ui/LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'spinner' | 'fullscreen' | 'inline';
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className = '',
  variant = 'spinner'
}: LoadingStateProps) {
  
  if (variant === 'fullscreen') {
    return (
      <div className={`fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="text-center">
          <LoadingSpinner size={size} />
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <LoadingSpinner size={size} />
      {message && <span className="text-gray-600">{message}</span>}
    </div>
  );
}

// Specialized loading components
export function PageLoading({ message = 'Memuat halaman...' }: { message?: string }) {
  return <LoadingState variant="fullscreen" message={message} />;
}

export function SectionLoading({ message = 'Memuat data...' }: { message?: string }) {
  return <LoadingState variant="inline" message={message} />;
}

export function ButtonLoading({ message = 'Memuat...' }: { message?: string }) {
  return <LoadingState size="sm" message={message} />;
}
