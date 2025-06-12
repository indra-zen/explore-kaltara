'use client';

import { Suspense } from 'react';
import BookingContent from './BookingContent';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
